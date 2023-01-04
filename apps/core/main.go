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
	"log"
	"net/http"
	"os"

	"github.com/Nerzal/gocloak/v12"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/tensorsystems/tensoremr/apps/core/internal/controller"
	"github.com/tensorsystems/tensoremr/apps/core/internal/middleware"
	"github.com/tensorsystems/tensoremr/apps/core/internal/proxy"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func main() {
	client := gocloak.NewClient("http://localhost:8080")

	// Open redis connection
	redisClient, err := OpenRedis()
	if err != nil {
		log.Fatal("couldn't connect to redis: ", err)
	}

	// Services
	fhirService := service.FhirService{
		Client:      http.Client{},
		FhirBaseURL: "http://localhost:" + os.Getenv("APP_PORT") + "/fhir-server/api/v4/",
	}

	redisService := service.RedisService{RedisClient: redisClient}

	patientService := service.PatientService{
		RedisService: redisService,
		FhirService:  fhirService,
	}

	keycloakService := service.KeycloakService{Client: client, Realm: os.Getenv("KEYCLOAK_CLIENT_APP_REALM")}
	userService := service.UserService{KeycloakService: keycloakService, FhirService: fhirService}

	// Controllers
	userController := controller.UserController{
		KeycloakClient: client,
		FhirService:    fhirService,
		UserService:    userService,
	}

	patientController := controller.PatientController{PatientService: patientService}

	codeSystemService := service.CodeSystemService{}
	codeSystemController := controller.CodeSystemController{CodeSystemService: codeSystemService}

	slotService := service.SlotService{FhirService: fhirService}
	extensionService := service.ExtensionService{ExtensionUrl: os.Getenv("EXTENSIONS_URL")}
	organizationService := service.OrganizationService{FhirService: fhirService}
	encounterService := service.EncounterService{FhirService: fhirService}
	appointmentService := service.AppointmentService{FhirService: fhirService, UserService: userService, SlotService: slotService, ExtensionService: extensionService, OrganizationService: organizationService, EncounterService: encounterService}
	appointmentController := controller.AppointmentController{AppointmentService: appointmentService, UserService: userService}

	initFhirService := service.FhirService{
		Client:      http.Client{},
		FhirBaseURL: os.Getenv("FHIR_BASE_URL") + "/fhir-server/api/v4/",
	}

	valueSetService := service.ValueSetService{FhirService: initFhirService}
	initOrganizationService := service.OrganizationService{FhirService: initFhirService}
	initService := service.InitService{ValueSetService: valueSetService, OrganizationService: initOrganizationService}
	if err := initService.InitOrganization(); err != nil {
		panic(err)
	}

	r := gin.Default()

	r.SetTrustedProxies(nil)

	fhirProxy := proxy.FhirProxy{}
	r.Any("/fhir-server/api/*fhir", fhirProxy.Proxy, fhirProxy.Logger())

	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.AuthMiddleware(client))

	// Users
	r.POST("/users", userController.CreateUser)
	r.GET("/users", userController.GetAllUsers)
	r.PUT("/users/:id", userController.UpdateUser)
	r.GET("/users/:id", userController.GetOneUser)

	// Patient
	r.POST("/patients", patientController.CreatePatient)

	// Appointments
	r.POST("/appointmentResponse", appointmentController.SaveAppointmentResponse)
	r.POST("/appointments", appointmentController.CreateAppointment)

	// Code system
	r.GET("/codesystem/service-types", codeSystemController.GetServiceTypes)

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
