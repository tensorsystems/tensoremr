// go:build wireinject
// +build wireinject

package main

import (
	"context"
	"net/http"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/google/wire"
	"github.com/jackc/pgx/v5"
	ory "github.com/ory/client-go"
	"github.com/tensorsystems/tensoremr/apps/core/internal/controller"
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func InitFhirService(c http.Client, url string) fhir_rest.FhirService {
	wire.Build(fhir_rest.NewFhirService)
	return fhir_rest.FhirService{}
}

func InitActivityService(fhirService fhir_rest.FhirService) service.ActivityDefinitionService {
	wire.Build(repository.NewActivityDefinitionRepository, service.NewActivityDefinitionService)
	return service.ActivityDefinitionService{}
}

func InitExtensionService(extensionUrl string) service.ExtensionService {
	wire.Build(service.NewExtensionService)
	return service.ExtensionService{}
}

func InitAppointmentService(fhirService fhir_rest.FhirService, extensionService service.ExtensionService, userService service.UserService) service.AppointmentService {
	wire.Build(repository.NewAppointmentRepository, repository.NewEncounterRepository, repository.NewSlotRepository, repository.NewOrganizationRepository, service.NewAppointmentService)
	return service.AppointmentService{}
}

func InitEncounterService(fhirService fhir_rest.FhirService, careTeamService service.CareTeamService, patientService service.PatientService, activityDefinitionService service.ActivityDefinitionService, taskService service.TaskService, db *pgx.Conn) service.EncounterService {
	wire.Build(repository.NewEncounterRepository, service.NewEncounterService)
	return service.EncounterService{}
}

func InitOrganizationService(fhirService fhir_rest.FhirService) service.OrganizationService {
	wire.Build(repository.NewOrganizationRepository, service.NewOrganizationService)
	return service.OrganizationService{}
}

func InitPatientService(fhirService fhir_rest.FhirService, db *pgx.Conn) service.PatientService {
	wire.Build(repository.NewPatientRepository, service.NewPatientService)
	return service.PatientService{}
}

func InitSlotService(fhirService fhir_rest.FhirService) service.SlotService {
	wire.Build(repository.NewSlotRepository, service.NewSlotService)
	return service.SlotService{}
}

func InitTaskService(fhirService fhir_rest.FhirService) service.TaskService {
	wire.Build(repository.NewTaskRepository, service.NewTaskService)
	return service.TaskService{}
}

func InitPractitionerRepository(fhirService fhir_rest.FhirService) repository.PractitionerRepository {
	wire.Build(repository.NewPractitionerRepository)
	return repository.PractitionerRepository{}
}

func InitUserService(fhirService fhir_rest.FhirService, oryClient *ory.APIClient, context context.Context, schemaID string) service.UserService {
	wire.Build(service.NewUserService)
	return service.UserService{}
}

func InitCareTeamService(fhirService fhir_rest.FhirService) service.CareTeamService {
	wire.Build(repository.NewCareTeamRepository, service.NewCareTeamService)
	return service.CareTeamService{}
}

func InitRxNormService(client http.Client, autoCompleter *redisearch.Autocompleter, rxNormURL string) service.RxNormService {
	wire.Build(repository.NewRxNormRepository, service.NewRxNormService)
	return service.RxNormService{}
}

func InitLoincService(redisClient *redisearch.Client, loincConnect service.LouicConnect) service.LoincService {
	wire.Build(service.NewLoincService)
	return service.LoincService{}
}

func InitValueSetService(fhirService fhir_rest.FhirService) service.ValueSetService {
	wire.Build(service.NewValueSetService)
	return service.ValueSetService{}
}

func InitSeedService(fhirService fhir_rest.FhirService, organizationService service.OrganizationService, activityDefinitionService service.ActivityDefinitionService) service.SeedService {
	wire.Build(service.NewValueSetService, service.NewSeedService)
	return service.SeedService{}
}

func InitUserController(fhirService fhir_rest.FhirService, userService service.UserService) controller.UserController {
	wire.Build(controller.NewUserController)
	return controller.UserController{}
}

func InitPatientController(patientService service.PatientService) controller.PatientController {
	wire.Build(controller.NewPatientController)
	return controller.PatientController{}
}

func InitCodeSystemController(codeSystemService service.CodeSystemService) controller.CodeSystemController {
	wire.Build(controller.NewCodeSystemController)
	return controller.CodeSystemController{}
}

func InitAppointmentController(appointmentService service.AppointmentService) controller.AppointmentController {
	wire.Build(controller.NewAppointmentController)
	return controller.AppointmentController{}
}

func InitOrganizationController(organizationService service.OrganizationService) controller.OrganizationController {
	wire.Build(controller.NewOrganizationController)
	return controller.OrganizationController{}
}

func InitEncounterController(encounterService service.EncounterService) controller.EncounterController {
	wire.Build(controller.NewEncounterController)
	return controller.EncounterController{}
}

func InitRxNormController(rxNormService service.RxNormService) controller.RxNormController {
	wire.Build(controller.NewRxNormController)
	return controller.RxNormController{}
}

func InitLoincController(loincService service.LoincService) controller.LoincController {
	wire.Build(controller.NewLoincController)
	return controller.LoincController{}
}

