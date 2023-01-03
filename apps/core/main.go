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
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strconv"

	"github.com/Nerzal/gocloak/v12"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/controller"
	"github.com/tensorsystems/tensoremr/apps/core/internal/middleware"
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
	appointmentService := service.AppointmentService{FhirService: fhirService, UserService: userService, SlotService: slotService, ExtensionService: extensionService}
	appointmentController := controller.AppointmentController{AppointmentService: appointmentService, UserService: userService}

	initFhirService := service.FhirService{
		Client:      http.Client{},
		FhirBaseURL: os.Getenv("FHIR_BASE_URL") + "/fhir-server/api/v4/",
	}

	valueSetService := service.ValueSetService{FhirService: initFhirService}
	organizationService := service.OrganizationService{FhirService: initFhirService}
	if err := InitOrganization(valueSetService, organizationService); err != nil {
		panic(err)
	}

	r := gin.Default()

	r.SetTrustedProxies(nil)
	r.Any("/fhir-server/api/*fhir", fhirProxy, Logger())

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

func InitOrganization(valueSetService service.ValueSetService, organizationService service.OrganizationService) error {
	organizationId := os.Getenv("ORGANIZATION_ID")
	organizationName := os.Getenv("ORGANIZATION_NAME")
	organizationTypeCode := os.Getenv("ORGANIZATION_TYPE_CODE")
	organizationPhone := os.Getenv("ORGANIZATION_CONTACT_PHONE")
	organizationEmail := os.Getenv("ORGANIZATION_CONTACT_EMAIL")
	organizationAddressLine1 := os.Getenv("ORGANIZATION_ADDRESS_LINE_1")
	organizationAddressLine2 := os.Getenv("ORGANIZATION_ADDRESS_LINE_2")
	organizationAddressCity := os.Getenv("ORGANIZATION_ADDRESS_CITY")
	organizationAddressDistrict := os.Getenv("ORGANIZATION_ADDRESS_DISTRICT")
	organizationAddressState := os.Getenv("ORGANIZATION_ADDRESS_STATE")
	organizationAddressPostalCode := os.Getenv("ORGANIZATION_ADDRESS_POSTAL_CODE")
	organizationAddressCountry := os.Getenv("ORGANIZATION_ADDRESS_COUNTRY")
	organizationContactGivenName := os.Getenv("ORGANIZATION_CONTACT_GIVEN_NAME")
	organizationContactFamilyName := os.Getenv("ORGANIZATION_CONTACT_FAMILY_NAME")
	organizationContactPhone := os.Getenv("ORGANIZATION_CONTACT_PHONE")
	organizationContactEmail := os.Getenv("ORGANIZATION_CONTACT_EMAIL")

	existing, err := organizationService.GetOneOrganizationByIdentifier(organizationId)
	if err != nil {
		return err
	}

	if *existing.Total > 0 {
		return nil
	}

	valueSet, err := valueSetService.GetOrganizationTypes()
	if err != nil {
		return err
	}

	var organizationType fhir.ValueSetExpansionContains
	for _, value := range valueSet.Expansion.Contains {
		if *value.Code == organizationTypeCode {
			organizationType = value
		}
	}

	active := true
	phoneSystem := fhir.ContactPointSystemPhone
	emailSystem := fhir.ContactPointSystemEmail
	contactPointUseWork := fhir.ContactPointUseWork
	addressUseWork := fhir.AddressUseWork

	identifierUse := fhir.IdentifierUseUsual
	identifierSystem := "http://hl7.org/fhir/ValueSet/identifier-type"
	identifierVersion := "4.3.0"
	identifierCode := "XX"
	identifierDisplay := "Organization identifier"

	organization := fhir.Organization{
		Active: &active,
		Identifier: []fhir.Identifier{
			{
				Use: &identifierUse,
				Type: &fhir.CodeableConcept{
					Coding: []fhir.Coding{
						{
							System:  &identifierSystem,
							Version: &identifierVersion,
							Code:    &identifierCode,
							Display: &identifierDisplay,
						},
					},
				},
				Value: &organizationId,
			},
		},
		Type: []fhir.CodeableConcept{
			{
				Coding: []fhir.Coding{
					{
						System:  valueSet.Url,
						Version: valueSet.Version,
						Code:    organizationType.Code,
						Display: organizationType.Display,
					},
				},
				Text: organizationType.Display,
			},
		},
		Name: &organizationName,
		Telecom: []fhir.ContactPoint{
			{
				System: &phoneSystem,
				Value:  &organizationPhone,
				Use:    &contactPointUseWork,
			},
			{
				System: &emailSystem,
				Value:  &organizationEmail,
				Use:    &contactPointUseWork,
			},
		},
		Address: []fhir.Address{
			{
				Use: &addressUseWork,
				Line: []string{
					organizationAddressLine1,
					organizationAddressLine2,
				},
				City:       &organizationAddressCity,
				District:   &organizationAddressDistrict,
				State:      &organizationAddressState,
				PostalCode: &organizationAddressPostalCode,
				Country:    &organizationAddressCountry,
			},
		},
		Contact: []fhir.OrganizationContact{
			{
				Name: &fhir.HumanName{
					Family: &organizationContactFamilyName,
					Given:  []string{organizationContactGivenName},
				},
				Telecom: []fhir.ContactPoint{
					{
						System: &phoneSystem,
						Value:  &organizationContactPhone,
					},
					{
						System: &emailSystem,
						Value:  &organizationContactEmail,
					},
				},
			},
		},
	}

	_, err = organizationService.CreateOrganization(organization)
	if err != nil {
		return err
	}

	return nil
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

func fhirProxy(c *gin.Context) {
	baseUrl := os.Getenv("FHIR_BASE_URL")

	remote, err := url.Parse(baseUrl)
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)
	proxy.Transport = &transport{http.DefaultTransport}
	originalDirector := proxy.Director

	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		modifyRequest(req)
	}

	proxy.ModifyResponse = modifyResponse()
	proxy.ErrorHandler = errorHandler()

	proxy.ServeHTTP(c.Writer, c.Request)
}

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// access the status we are sending
		status := c.Writer.Status()

		log.Println(status)

		test := c.Request.RequestURI
		log.Println(test)
	}
}

func modifyRequest(req *http.Request) {
	username := os.Getenv("FHIR_USERNAME")
	password := os.Getenv("FHIR_PASSWORD")

	req.Header.Set("X-Proxy", "fhir-Reverse-Proxy")
	req.SetBasicAuth(username, password)
}

func errorHandler() func(http.ResponseWriter, *http.Request, error) {
	return func(w http.ResponseWriter, req *http.Request, err error) {
		fmt.Printf("Got error while modifying response: %v \n", err)

		return
	}
}

func modifyResponse() func(*http.Response) error {
	return func(resp *http.Response) error {
		return nil
	}
}

type transport struct {
	http.RoundTripper
}

func (t *transport) RoundTrip(req *http.Request) (resp *http.Response, err error) {
	resp, err = t.RoundTripper.RoundTrip(req)
	if err != nil {
		return nil, err
	}
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	err = resp.Body.Close()
	if err != nil {
		return nil, err
	}
	b = bytes.Replace(b, []byte("server"), []byte("schmerver"), -1)
	body := ioutil.NopCloser(bytes.NewReader(b))
	resp.Body = body
	resp.ContentLength = int64(len(b))
	resp.Header.Set("Content-Length", strconv.Itoa(len(b)))
	return resp, nil
}
