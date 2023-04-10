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
	"github.com/tensorsystems/tensoremr/apps/core/internal/middleware"
	"github.com/tensorsystems/tensoremr/apps/core/internal/proxy"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
	"github.com/tensorsystems/tensoremr/apps/core/internal/wire"
)

var oryAuthedContext = context.WithValue(context.Background(), ory.ContextAccessToken, os.Getenv("ORY_API_KEY"))

func main() {
	appMode := os.Getenv("APP_MODE")
	port := os.Getenv("APP_PORT")

	// Security
	configuration := ory.NewConfiguration()
	configuration.Servers = []ory.ServerConfiguration{{URL: os.Getenv("ORY_URL")}}
	oryClient := ory.NewAPIClient(configuration)

	// Open Postgres
	postgresDb, err := OpenPostgres()
	if err != nil {
		log.Fatal("couldn't connect to postgres: ", err)
	}

	if err := postgresDb.Ping(context.Background()); err != nil {
		log.Fatal(err)
	}

	// Loinc client
	loincClient := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), os.Getenv("LOINC_INDEX"))
	_, err = loincClient.Info()
	if err != nil {
		log.Fatal("Could not find loinc index. Please run loinc-import first")
	}

	// Services
	fhirService := wire.InitFhirService(service.FHIRConfig{
		URL:      "http://localhost:" + os.Getenv("APP_PORT") + "/fhir-server/api/v4",
		Username: os.Getenv("FHIR_USERNAME"),
		Password: os.Getenv("FHIR_PASSWORD"),
	})
	activityDefinitionService := wire.InitActivityService(fhirService)
	organizationService := wire.InitOrganizationService(fhirService)
	patientService := wire.InitPatientService(fhirService, postgresDb)
	taskService := wire.InitTaskService(fhirService)
	userService := wire.InitUserService(fhirService, oryClient, oryAuthedContext, os.Getenv("ORY_IDENTITY_SCHEMA_ID"))
	careTeamService := wire.InitCareTeamService(fhirService)
	extensionService := wire.InitExtensionService(os.Getenv("EXTENSIONS_URL"))
	encounterService := wire.InitEncounterService(fhirService, careTeamService, patientService, activityDefinitionService, taskService, postgresDb)
	slotService := wire.InitSlotService(fhirService)
	appointmentService := wire.InitAppointmentService(fhirService, encounterService, slotService, organizationService, extensionService, userService)
	rxNormService := wire.InitRxNormService(http.Client{}, redisearch.NewAutocompleter(os.Getenv("REDIS_ADDRESS"), os.Getenv("RXNORM_AUTOCOMPLETER_NAME")), os.Getenv("RXNORM_ADDRESS"))
	codeSystemService := service.CodeSystemService{}
	loincService := wire.InitLoincService(loincClient, service.LouicConnect{LoincFhirBaseURL: os.Getenv("LOINC_FHIR_BASE_URL"), LoincFhirUsername: os.Getenv("LOINC_FHIR_USERNAME"), LoincFhirPassword: os.Getenv("LOINC_FHIR_PASSWORD")})

	// Controllers
	userController := wire.InitUserController(fhirService, userService)
	patientController := wire.InitPatientController(patientService)
	codeSystemController := wire.InitCodeSystemController(codeSystemService)
	appointmentController := wire.InitAppointmentController(appointmentService)
	organizationController := wire.InitOrganizationController(organizationService)
	encounterController := wire.InitEncounterController(encounterService)
	rxNormController := wire.InitRxNormController(rxNormService)
	loincController := wire.InitLoincController(loincService)
	utilController := controller.UtilController{}

	// Initialization
	initFhirService := service.FHIRService{Config: service.FHIRConfig{URL: os.Getenv("FHIR_BASE_URL") + "/fhir-server/api/v4/", Username: os.Getenv("FHIR_USERNAME"), Password: os.Getenv("FHIR_PASSWORD")}}
	if !initFhirService.HaveConnection() {
		log.Fatal("could not connect to FHIR service")
	}

	initUserService := service.NewUserService(initFhirService, oryClient, oryAuthedContext, os.Getenv("ORY_IDENTITY_SCHEMA_ID"))
	seedService := service.NewSeedService(initUserService)
	if appMode == "dev" {
		seedService.SeedUsers()
	}

	r := gin.Default()
	r.SetTrustedProxies(nil)

	// FHIR Proxy
	fhirProxy := proxy.FhirProxy{}
	r.Any("/fhir-server/api/*fhir", fhirProxy.Proxy, fhirProxy.Logger())

	// Snowstorm proxy
	snomedProxy := proxy.SnomedProxy{}
	r.Use(middleware.CORSMiddleware())
	r.Any("/snomed/*proxyPath", snomedProxy.Proxy, snomedProxy.Logger())

	// Routes
	r.GET("/currentOrganization", organizationController.GetCurrentOrganization)

	r.PUT("/users/:id", userController.UpdateUser)
	r.GET("/users/:id", userController.GetOneUser)
	r.DELETE("/users/:id", userController.DeleteUserIdentity)
	r.GET("/users/:id/recovery", userController.GetRecoveryLink)
	r.POST("/users", userController.CreateUser)
	r.GET("/users", userController.GetAllUsers)
	r.GET("/currentUser", userController.GetCurrentUser)

	r.GET("/patients/:id", patientController.GetOnePatient)
	r.POST("/patients", patientController.CreatePatient)

	r.POST("/appointmentResponse", appointmentController.SaveAppointmentResponse)
	r.POST("/appointments", appointmentController.CreateAppointment)

	r.POST("/encounters", encounterController.CreateEncounter)

	r.GET("/codesystem/service-types", codeSystemController.GetServiceTypes)

	r.GET("/time", utilController.GetServerTime)

	r.GET("/rxnorm/suggest", rxNormController.Suggest)
	r.GET("/rxnorm/getApproximateTerms", rxNormController.GetApproximateTerms)
	r.GET("/rxnorm/:rxcui/getAllRelatedInfo", rxNormController.GetAllRelatedInfo)

	r.GET("/loinc/searchForms", loincController.SearchForms)
	r.GET("/questionnaire/loinc/:id", loincController.GetLoincQuestionnaire)

	r.Static("/templates", "./public/templates")
	r.Static("/questionnaire/local", "./public/questionnaire")

	if appMode == "prod" {
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
