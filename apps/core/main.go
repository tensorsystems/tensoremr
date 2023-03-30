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

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/jackc/pgx/v5"
	ory "github.com/ory/client-go"
	"github.com/tensorsystems/tensoremr/apps/core/internal/controller"
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/middleware"
	"github.com/tensorsystems/tensoremr/apps/core/internal/proxy"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

var oryAuthedContext = context.WithValue(context.Background(), ory.ContextAccessToken, os.Getenv("ORY_API_KEY"))

func main() {
	configuration := ory.NewConfiguration()
	configuration.Servers = []ory.ServerConfiguration{
		{
			URL: os.Getenv("ORY_URL"), // Ory Identities API
		},
	}
	oryClient := ory.NewAPIClient(configuration)

	// Open Postgres
	postgresDb, err := OpenPostgres()
	if err != nil {
		log.Fatal("couldn't connect to postgres: ", err)
	}

	if err := postgresDb.Ping(context.Background()); err != nil {
		log.Fatal(err)
	}

	loincClient := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), os.Getenv("LOINC_INDEX"))

	// Check if loinc index exists
	_, err = loincClient.Info()
	if err != nil {
		log.Fatal("Could not find loinc index. Please run loinc-import first")
	}

	fhirService := fhir_rest.FhirService{Client: http.Client{}, FhirBaseURL: "http://localhost:" + os.Getenv("APP_PORT") + "/fhir-server/api/v4"}

	// Repository
	activityDefinitionRepository := repository.ActivityDefinitionRepository{FhirService: fhirService}
	appointmentRepository := repository.AppointmentRepository{FhirService: fhirService}
	encounterRepository := repository.EncounterRepository{FhirService: fhirService}
	organizationRepository := repository.OrganizationRepository{FhirService: fhirService}
	patientRepository := repository.PatientRepository{FhirService: fhirService}
	slotRepository := repository.SlotRepository{FhirService: fhirService}
	taskRepository := repository.TaskRepository{FhirService: fhirService}
	practitionerRepository := repository.PractitionerRepository{FhirService: fhirService}
	userRepository := repository.UserRepository{FhirService: fhirService, PractitionerRepository: practitionerRepository}
	careTeamRepository := repository.CareTeamRepository{FhirService: fhirService}
	rxNormRepository := repository.RxNormRepository{HttpClient: http.Client{}, Autocompleter: redisearch.NewAutocompleter(os.Getenv("REDIS_ADDRESS"), os.Getenv("RXNORM_AUTOCOMPLETER_NAME")), RxNormURL: os.Getenv("RXNORM_ADDRESS")}

	// Services
	activityDefinitionService := service.ActivityDefinitionService{ActivityDefinitionRepository: activityDefinitionRepository}
	organizationService := service.OrganizationService{OrganizationRepository: organizationRepository}
	patientService := service.PatientService{PatientRepository: patientRepository, SqlDB: postgresDb}
	taskService := service.TaskService{TaskRepository: taskRepository}
	userService := service.UserService{FhirService: fhirService, OryClient: oryClient, Context: oryAuthedContext, IdentitySchemaID: os.Getenv("ORY_IDENTITY_SCHEMA_ID")}
	extensionService := service.ExtensionService{ExtensionUrl: os.Getenv("EXTENSIONS_URL")}
	careTeamService := service.CareTeamService{CareTeamRepository: careTeamRepository}
	appointmentService := service.AppointmentService{AppointmentRepository: appointmentRepository, EncounterRepository: encounterRepository, SlotRepository: slotRepository, OrganizationRepository: organizationRepository, UserRepository: userRepository, ExtensionService: extensionService}
	encounterService := service.EncounterService{EncounterRepository: encounterRepository, ActivityDefinitionService: activityDefinitionService, TaskService: taskService, CareTeamService: careTeamService, PatientService: patientService, SqlDB: postgresDb}
	rxNormService := service.RxNormService{RxNormRepository: rxNormRepository}
	loincService := service.LoincService{Client: loincClient, LoincFhirBaseURL: os.Getenv("LOINC_FHIR_BASE_URL"), LoincFhirUsername: os.Getenv("LOINC_FHIR_USERNAME"), LoincFhirPassword: os.Getenv("LOINC_FHIR_PASSWORD")}
	ketoService := service.KetoService{URL: os.Getenv("KETO_URL"), AccessToken: os.Getenv("KETO_ACCESS_KEY")}

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
	userController := controller.UserController{FhirService: fhirService, UserService: userService}
	patientController := controller.PatientController{PatientService: patientService}
	codeSystemController := controller.CodeSystemController{CodeSystemService: codeSystemService}
	appointmentController := controller.AppointmentController{AppointmentService: appointmentService, UserService: userService}
	organizationController := controller.OrganizationController{OrganizationService: organizationService}
	encounterController := controller.EncounterController{EncounterService: encounterService, ActivityDefinitionService: activityDefinitionService, TaskService: taskService}
	utilController := controller.UtilController{}
	rxNormController := controller.RxNormController{RxNormService: rxNormService}
	loincController := controller.LoincController{LoincService: loincService}
	ketoController := controller.KetoController{KetoService: ketoService}

	// Initialize Organization
	if err := initService.InitOrganization(); err != nil {
		panic(err)
	}

	// Initialize Activity Definitions
	if err := initService.InitActivityDefinition(); err != nil {
		panic(err)
	}

	// Initialize admin acount
	_, err = userService.CreateDefaultAdminAccount()
	if err != nil {
		log.Fatalln("Could not create admin account: ", err)
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

	//r.Use(middleware.AuthMiddleware(client))

	// Organization
	r.GET("/currentOrganization", organizationController.GetCurrentOrganization)

	// Users
	r.PUT("/users/:id", userController.UpdateUser)
	r.GET("/users/:id", userController.GetOneUser)
	r.DELETE("/users/:id", userController.DeleteUserIdentity)
	r.GET("/users/:id/recovery", userController.GetRecoveryLink)
	r.POST("/users", userController.CreateUser)
	r.GET("/users", userController.GetAllUsers)
	r.GET("/currentUser", userController.GetCurrentUser)

	// Patient
	r.GET("/patients/:id", patientController.GetOnePatient)
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

	// Loinc
	r.GET("/loinc/searchForms", loincController.SearchForms)
	r.GET("/questionnaire/loinc/:id", loincController.GetLoincQuestionnaire)

	// Keto
	r.GET("/relation-tuples/:subjectId", ketoController.GetSubjectRelations)

	// Files
	r.Static("/templates", "./public/templates")
	r.Static("/questionnaire/local", "./public/questionnaire")

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
