/*
  Copyright 2021 Kidus Tiliksew

  This file is part of Tensor EMR.

  Tensor EMR is free software: you can redistribute it and/or modify
  it under the terms of the version 2 of GNU General Public License as published by
  the Free Software Foundation.

  Tensor EMR is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Nerzal/gocloak/v12"
	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/jackc/pgx/v5"
	"github.com/tensorsystems/tensoremr/apps/core/internal/controller"
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/keycloak"
	"github.com/tensorsystems/tensoremr/apps/core/internal/middleware"
	"github.com/tensorsystems/tensoremr/apps/core/internal/proxy"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func main() {
	client := gocloak.NewClient("http://localhost:8080")

	// Open Sqlite
	postgresDb, err := OpenPostgres()
	if err != nil {
		log.Fatal("couldn't connect to postgres: ", err)
	}

	if err := postgresDb.Ping(context.Background()); err != nil {
		panic(err)
	}

	fhirService := fhir_rest.FhirService{Client: http.Client{}, FhirBaseURL: "http://localhost:" + os.Getenv("APP_PORT") + "/fhir-server/api/v4"}
	keycloakService := keycloak.KeycloakService{Client: client, Realm: os.Getenv("KEYCLOAK_CLIENT_APP_REALM")}

	// Repository
	activityDefinitionRepository := repository.ActivityDefinitionRepository{FhirService: fhirService, KeycloakService: keycloakService}
	appointmentRepository := repository.AppointmentRepository{FhirService: fhirService}
	encounterRepository := repository.EncounterRepository{FhirService: fhirService}
	organizationRepository := repository.OrganizationRepository{FhirService: fhirService}
	patientRepository := repository.PatientRepository{FhirService: fhirService}
	slotRepository := repository.SlotRepository{FhirService: fhirService}
	taskRepository := repository.TaskRepository{FhirService: fhirService}
	practitionerRepository := repository.PractitionerRepository{FhirService: fhirService}
	userRepository := repository.UserRepository{FhirService: fhirService, PractitionerRepository: practitionerRepository, KeycloakService: keycloakService}
	rxNormRepository := repository.RxNormRepository{HttpClient: http.Client{}, Autocompleter: redisearch.NewAutocompleter(os.Getenv("REDIS_ADDRESS"), os.Getenv("RXNORM_AUTOCOMPLETER_NAME")), RxNormURL: os.Getenv("RXNORM_ADDRESS")}

	// Services
	activityDefinitionService := service.ActivityDefinitionService{ActivityDefinitionRepository: activityDefinitionRepository, KeycloakService: keycloakService}
	organizationService := service.OrganizationService{OrganizationRepository: organizationRepository}
	patientService := service.PatientService{PatientRepository: patientRepository, SqlDB: postgresDb}
	taskService := service.TaskService{TaskRepository: taskRepository}
	userService := service.UserService{UserRepository: userRepository}
	extensionService := service.ExtensionService{ExtensionUrl: os.Getenv("EXTENSIONS_URL")}
	appointmentService := service.AppointmentService{AppointmentRepository: appointmentRepository, EncounterRepository: encounterRepository, SlotRepository: slotRepository, OrganizationRepository: organizationRepository, UserRepository: userRepository, ExtensionService: extensionService}
	encounterService := service.EncounterService{EncounterRepository: encounterRepository, ActivityDefinitionService: activityDefinitionService, TaskService: taskService, SqlDB: postgresDb}
	rxNormService := service.RxNormService{RxNormRepository: rxNormRepository}

	// Initialization
	initFhirService := fhir_rest.FhirService{Client: http.Client{}, FhirBaseURL: os.Getenv("FHIR_BASE_URL") + "/fhir-server/api/v4/"}
	initOrganizationRepository := repository.OrganizationRepository{FhirService: initFhirService}
	initOrganizationService := service.OrganizationService{OrganizationRepository: initOrganizationRepository}
	initActivityRepository := repository.ActivityDefinitionRepository{FhirService: initFhirService}
	initActivityService := service.ActivityDefinitionService{ActivityDefinitionRepository: initActivityRepository}
	valueSetService := service.ValueSetService{FhirService: initFhirService}

	initService := service.InitService{ValueSetService: valueSetService, OrganizationService: initOrganizationService, ActivityDefinitionService: initActivityService}
	codeSystemService := service.CodeSystemService{}

	// Controllers
	userController := controller.UserController{KeycloakClient: client, FhirService: fhirService, UserService: userService}
	patientController := controller.PatientController{PatientService: patientService}
	codeSystemController := controller.CodeSystemController{CodeSystemService: codeSystemService}
	appointmentController := controller.AppointmentController{AppointmentService: appointmentService, UserService: userService}
	organizationController := controller.OrganizationController{OrganizationService: organizationService}
	encounterController := controller.EncounterController{EncounterService: encounterService, ActivityDefinitionService: activityDefinitionService, TaskService: taskService}
	utilController := controller.UtilController{}
	rxNormController := controller.RxNormController{RxNormService: rxNormService}

	// Initialize Organization
	if err := initService.InitOrganization(); err != nil {
		panic(err)
	}

	// Initialize Activity Definitions
	if err := initService.InitActivityDefinition(); err != nil {
		panic(err)
	}

	// Load RxNorm display terms
	// if err := rxNormService.SaveDisplayNames(); err != nil {
	// 	panic(err)
	// }

	r := gin.Default()

	r.SetTrustedProxies(nil)

	fhirProxy := proxy.FhirProxy{}
	r.Any("/fhir-server/api/*fhir", fhirProxy.Proxy, fhirProxy.Logger())

	snomedProxy := proxy.SnomedProxy{}
	r.Use(middleware.CORSMiddleware())
	r.Any("/snomed/*proxyPath", snomedProxy.Proxy, snomedProxy.Logger())

	r.Use(middleware.AuthMiddleware(client))

	// Organization
	r.GET("/currentOrganization", organizationController.GetCurrentOrganization)

	// Users
	r.POST("/users", userController.CreateUser)
	r.GET("/users", userController.GetAllUsers)
	r.PUT("/users/:id", userController.UpdateUser)
	r.GET("/users/:id", userController.GetOneUser)
	r.GET("/currentUser", userController.GetCurrentUser)

	// Patient
	r.POST("/patients", patientController.CreatePatient)

	// Appointments
	r.POST("/appointmentResponse", appointmentController.SaveAppointmentResponse)
	r.POST("/appointments", appointmentController.CreateAppointment)

	// Encounter
	r.POST("/encounters", encounterController.CreateEncounter)

	// Code system
	r.GET("/codesystem/service-types", codeSystemController.GetServiceTypes)

	// Server Time
	r.GET("/time", utilController.GetServerTime)

	// RxNorm
	r.GET("/rxnorm/suggest", rxNormController.Suggest)
	r.GET("/rxnorm/getApproximateTerms", rxNormController.GetApproximateTerms)
	r.GET("/rxnorm/:rxcui/getAllRelatedInfo", rxNormController.GetAllRelatedInfo)

	// Files 
	r.Static("/templates", "./public/templates")
	r.Static("/questionnaire", "./public/questionnaire")


	appMode := os.Getenv("APP_MODE")
	port := os.Getenv("APP_PORT")

	if appMode == "release" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	r.Run(":" + port)
}

func OpenRedis() (*redis.Client, error) {
	redisAddress := os.Getenv("REDIS_ADDRESS")

	rdb := redis.NewClient(&redis.Options{
		Addr:     redisAddress,
		Password: "",
		DB:       0,
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		return nil, err
	}

	return rdb, nil
}

func OpenPostgres() (*pgx.Conn, error) {
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	connStr := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable TimeZone=UTC password=%s", dbHost, dbPort, dbUser, dbName, dbPassword)

	return pgx.Connect(context.Background(), connStr)
}
