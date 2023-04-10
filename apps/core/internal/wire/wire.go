//go:build wireinject
// +build wireinject

package wire

import (
	"context"
	"net/http"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/google/wire"
	"github.com/jackc/pgx/v5"
	ory "github.com/ory/client-go"
	"github.com/tensorsystems/tensoremr/apps/core/internal/controller"

	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func InitFhirService(config service.FHIRConfig) service.FHIRService {
	wire.Build(service.NewFHIRService)
	return service.FHIRService{}
}

func InitActivityService(fhirService service.FHIRService) service.ActivityDefinitionService {
	wire.Build(service.NewActivityDefinitionService)
	return service.ActivityDefinitionService{}
}

func InitExtensionService(extensionUrl string) service.ExtensionService {
	wire.Build(service.NewExtensionService)
	return service.ExtensionService{}
}

func InitAppointmentService(fhirService service.FHIRService, encounterService service.EncounterService, slotService service.SlotService, organizationService service.OrganizationService, extensionService service.ExtensionService, userService service.UserService) service.AppointmentService {
	wire.Build(service.NewAppointmentService)
	return service.AppointmentService{}
}

func InitEncounterService(fhirService service.FHIRService, careTeamService service.CareTeamService, patientService service.PatientService, activityDefinitionService service.ActivityDefinitionService, taskService service.TaskService, db *pgx.Conn) service.EncounterService {
	wire.Build(service.NewEncounterService)
	return service.EncounterService{}
}

func InitOrganizationService(fhirService service.FHIRService) service.OrganizationService {
	wire.Build(service.NewOrganizationService)
	return service.OrganizationService{}
}

func InitPatientService(fhirService service.FHIRService, db *pgx.Conn) service.PatientService {
	wire.Build(service.NewPatientService)
	return service.PatientService{}
}

func InitSlotService(fhirService service.FHIRService) service.SlotService {
	wire.Build(service.NewSlotService)
	return service.SlotService{}
}

func InitTaskService(fhirService service.FHIRService) service.TaskService {
	wire.Build(service.NewTaskService)
	return service.TaskService{}
}

func InitUserService(fhirService service.FHIRService, oryClient *ory.APIClient, context context.Context, schemaID string) service.UserService {
	wire.Build(service.NewUserService)
	return service.UserService{}
}

func InitCareTeamService(fhirService service.FHIRService) service.CareTeamService {
	wire.Build(service.NewCareTeamService)
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

func InitValueSetService(fhirService service.FHIRService) service.ValueSetService {
	wire.Build(service.NewValueSetService)
	return service.ValueSetService{}
}

func InitSeedService(fhirService service.FHIRService, userService service.UserService) service.SeedService {
	wire.Build(service.NewSeedService)
	return service.SeedService{}
}

func InitUserController(fhirService service.FHIRService, userService service.UserService) controller.UserController {
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
