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

package service_test

import (
	"context"
	"testing"

	"github.com/Nerzal/gocloak/v12"
	"github.com/tensorsystems/tensoremr/apps/core/internal/keycloak"
)

var appointmentKeycloakService keycloak.KeycloakService
var appointmentToken string

func setupAppointmentTest(t *testing.T) func(t *testing.T) {
	client := gocloak.NewClient("http://localhost:8080")
	clientId := "core-app"
	clientSecret := "hMn2XimtjjS5NDGTPXVMii5dHDePdODT"
	clientMasterRealm := "master"

	token, err := client.LoginClient(context.Background(), clientId, clientSecret, clientMasterRealm)
	if err != nil {
		t.Fatal(err)
	}

	appointmentToken = token.AccessToken

	appointmentKeycloakService = keycloak.KeycloakService{
		Client: client,
		Realm:  "TensorEMR",
	}

	return func(t *testing.T) {}
}

func TestSaveAppointmentResponse(t *testing.T) {
	// s := setupAppointmentTest(t)
	// defer s(t)

	// fhirService := fhir_rest.FhirService{Client: http.Client{}, FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/"}
	// userRepository := repository.UserRepository{FhirService: fhirService, KeycloakService: appointmentKeycloakService}
	// userService := service.UserService{UserRepository: userRepository}
	// slotRepository := repository.SlotRepository{FhirService: fhirService}
	// slotService := service.SlotService{SlotRepository: slotRepository}
	// extensionService := service.ExtensionService{ExtensionUrl: "http://localhost:8082/extensions"}

	// appointmentRepository := repository.AppointmentRepository{FhirService: fhirService}
	// encounterRepository := repository.EncounterRepository{FhirService: fhirService}
	// organizationRepository := repository.OrganizationRepository{FhirService: fhirService}
	// appointmentService := service.AppointmentService{AppointmentRepository: appointmentRepository, EncounterRepository: encounterRepository, SlotRepository: slotRepository, OrganizationRepository: organizationRepository, UserRepository: userRepository, ExtensionService: extensionService}

	// scheduleRepository := repository.ScheduleRepository{FhirService: fhirService}
	// scheduleService := service.ScheduleService{ScheduleRepository: scheduleRepository}

	// u1 := map[string]interface{}{
	// 	"accountType":   "physician",
	// 	"namePrefix":    "Dr.",
	// 	"givenName":     "Test",
	// 	"familyName":    "User 2",
	// 	"email":         "test2@gmail.com",
	// 	"contactNumber": "0911000000",
	// 	"password":      "password",
	// }

	// p := payload.CreateUserPayload{
	// 	Role:            u1["accountType"].(string),
	// 	NamePrefix:      u1["namePrefix"].(string),
	// 	GivenName:       u1["givenName"].(string),
	// 	FamilyName:      u1["familyName"].(string),
	// 	Email:           u1["email"].(string),
	// 	ContactNumber:   u1["contactNumber"].(string),
	// 	Password:        u1["password"].(string),
	// 	ConfirmPassword: u1["password"].(string),
	// }

	// user, _, err := userService.CreateOneUser(p)
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// u2 := map[string]interface{}{
	// 	"accountType":   "physician",
	// 	"namePrefix":    "Dr.",
	// 	"givenName":     "Test",
	// 	"familyName":    "User 2",
	// 	"email":         "test3@gmail.com",
	// 	"contactNumber": "0911000000",
	// 	"password":      "password",
	// }

	// p = payload.CreateUserPayload{
	// 	Role:            u2["role"].(string),
	// 	NamePrefix:      u2["namePrefix"].(string),
	// 	GivenName:       u2["givenName"].(string),
	// 	FamilyName:      u2["familyName"].(string),
	// 	Email:           u2["email"].(string),
	// 	ContactNumber:   u2["contactNumber"].(string),
	// 	Password:        u2["password"].(string),
	// 	ConfirmPassword: u2["password"].(string),
	// }

	// user2, _, err := userService.CreateOneUser(p)
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// // Create Schedule
	// actorRef := "Practitioner/" + user.Id
	// actorRefType := "Practitioner"
	// sc := fhir.Schedule{
	// 	Actor: []fhir.Reference{
	// 		{
	// 			Reference: &actorRef,
	// 			Type:      &actorRefType,
	// 		},
	// 	},
	// }

	// schedule, err := scheduleService.CreateSchedule(sc)
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// // Create slot
	// scheduleRef := "Schedule/" + *schedule.Id
	// scheduleType := "Schedule"
	// extensions, err := extensionService.GetExtensions()
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// extUrl := extensions["EXT_SLOT_APPOINTMENTS_LIMIT"].(string)
	// appointmentsLimit := 1

	// start := time.Now().Format(time.RFC3339)
	// end := time.Now().Format(time.RFC3339)

	// sl := fhir.Slot{
	// 	Start:  start,
	// 	End:    end,
	// 	Status: fhir.SlotStatusFree,
	// 	Schedule: fhir.Reference{
	// 		Reference: &scheduleRef,
	// 		Type:      &scheduleType,
	// 	},
	// 	Extension: []fhir.Extension{
	// 		{
	// 			Url:          extUrl,
	// 			ValueInteger: &appointmentsLimit,
	// 		},
	// 	},
	// }

	// slot, err := slotService.CreateSlot(sl)
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// proposedAppointmentStatus := fhir.AppointmentStatusProposed

	// // User 1
	// reference := "Practitioner/" + user.Id
	// referenceType := "Practitioner"
	// participantRequired := fhir.ParticipantRequiredRequired
	// participantStatus := fhir.ParticipationStatusNeedsAction

	// // User 2
	// reference2 := "Practitioner/" + user2.Id
	// referenceType2 := "Practitioner"

	// participant := []fhir.AppointmentParticipant{
	// 	{
	// 		Actor: &fhir.Reference{
	// 			Reference: &reference,
	// 			Type:      &referenceType,
	// 		},
	// 		Required: &participantRequired,
	// 		Status:   participantStatus,
	// 	},
	// 	{
	// 		Actor: &fhir.Reference{
	// 			Reference: &reference2,
	// 			Type:      &referenceType2,
	// 		},
	// 		Required: &participantRequired,
	// 		Status:   participantStatus,
	// 	},
	// }

	// slotRef := "Slot/" + *slot.Id
	// slotRefType := "Slot"
	// appointment := fhir.Appointment{
	// 	Status:      proposedAppointmentStatus,
	// 	Participant: participant,
	// 	Start:       &start,
	// 	End:         &end,
	// 	Slot: []fhir.Reference{
	// 		{
	// 			Reference: &slotRef,
	// 			Type:      &slotRefType,
	// 		},
	// 	},
	// }

	// savedAppointment, err := appointmentService.CreateAppointment(appointment)
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// t.Run("Sets appointment to booked if all participants have accepted", func(t *testing.T) {
	// 	appointmentRef := "Appointment/" + *savedAppointment.Id
	// 	appointmentRefType := "Appointment"

	// 	actorRef := "Practitioner/" + user.Id
	// 	actorType := "Practitioner"

	// 	acceptedStatus := fhir.ParticipationStatusAccepted
	// 	appointmentResponse := fhir.AppointmentResponse{
	// 		Appointment: fhir.Reference{
	// 			Reference: &appointmentRef,
	// 			Type:      &appointmentRefType,
	// 		},
	// 		Start: savedAppointment.Start,
	// 		End:   savedAppointment.End,
	// 		Actor: &fhir.Reference{
	// 			Reference: &actorRef,
	// 			Type:      &actorType,
	// 		},
	// 		ParticipantStatus: acceptedStatus,
	// 	}

	// 	updatedAppointment, err := appointmentService.SaveAppointmentResponse(appointmentResponse, appointmentToken)
	// 	if err != nil {
	// 		t.Fatal(err)
	// 	}

	// 	for i, p := range updatedAppointment.Participant {
	// 		sp := strings.Split(*p.Actor.Reference, "/")
	// 		if len(sp) == 0 {
	// 			t.Fatal("Could not get actor")
	// 		}

	// 		if user.Id == sp[1] {
	// 			assert.Equal(t, acceptedStatus, updatedAppointment.Participant[i].Status)
	// 		}
	// 	}

	// 	assert.Equal(t, fhir.AppointmentStatusBooked, updatedAppointment.Status)
	// })

	// t.Run("Does not change appointment status if all required participants have not accepted", func(t *testing.T) {
	// 	tentativeStatus := fhir.ParticipationStatusTentative
	// 	savedAppointment.Status = proposedAppointmentStatus
	// 	_, err := appointmentService.UpdateAppointment(*savedAppointment)
	// 	if err != nil {
	// 		t.Fatal(err)
	// 	}

	// 	appointmentRef := "Appointment/" + *savedAppointment.Id
	// 	appointmentRefType := "Appointment"

	// 	actorRef := "Practitioner/" + user.Id
	// 	actorType := "Practitioner"

	// 	appointmentResponse := fhir.AppointmentResponse{
	// 		Appointment: fhir.Reference{
	// 			Reference: &appointmentRef,
	// 			Type:      &appointmentRefType,
	// 		},
	// 		Start: savedAppointment.Start,
	// 		End:   savedAppointment.End,
	// 		Actor: &fhir.Reference{
	// 			Reference: &actorRef,
	// 			Type:      &actorType,
	// 		},
	// 		ParticipantStatus: tentativeStatus,
	// 	}

	// 	updatedAppointment, err := appointmentService.SaveAppointmentResponse(appointmentResponse, appointmentToken)
	// 	if err != nil {
	// 		t.Fatal(err)
	// 	}

	// 	for i, p := range updatedAppointment.Participant {
	// 		sp := strings.Split(*p.Actor.Reference, "/")
	// 		if len(sp) == 0 {
	// 			t.Fatal("Could not get actor")
	// 		}

	// 		if user.Id == sp[1] {
	// 			assert.Equal(t, tentativeStatus, updatedAppointment.Participant[i].Status)
	// 		}
	// 	}

	// 	assert.Equal(t, fhir.AppointmentStatusProposed, updatedAppointment.Status)
	// })

	// t.Run("Cancels appointment if all participants decline", func(t *testing.T) {
	// 	declineStatus := fhir.ParticipationStatusDeclined
	// 	savedAppointment.Status = proposedAppointmentStatus
	// 	_, err := appointmentService.UpdateAppointment(*savedAppointment)
	// 	if err != nil {
	// 		t.Fatal(err)
	// 	}

	// 	appointmentRef := "Appointment/" + *savedAppointment.Id
	// 	appointmentRefType := "Appointment"

	// 	actorRef := "Practitioner/" + user.Id
	// 	actorType := "Practitioner"

	// 	appointmentResponse := fhir.AppointmentResponse{
	// 		Appointment: fhir.Reference{
	// 			Reference: &appointmentRef,
	// 			Type:      &appointmentRefType,
	// 		},
	// 		Start: savedAppointment.Start,
	// 		End:   savedAppointment.End,
	// 		Actor: &fhir.Reference{
	// 			Reference: &actorRef,
	// 			Type:      &actorType,
	// 		},
	// 		ParticipantStatus: declineStatus,
	// 	}

	// 	updatedAppointment, err := appointmentService.SaveAppointmentResponse(appointmentResponse, appointmentToken)
	// 	if err != nil {
	// 		t.Fatal(err)
	// 	}

	// 	for i, p := range updatedAppointment.Participant {
	// 		sp := strings.Split(*p.Actor.Reference, "/")
	// 		if len(sp) == 0 {
	// 			t.Fatal("Could not get actor")
	// 		}

	// 		if user.Id == sp[1] {
	// 			assert.Equal(t, declineStatus, updatedAppointment.Participant[i].Status)
	// 		}
	// 	}

	// 	assert.Equal(t, fhir.AppointmentStatusCancelled, updatedAppointment.Status)
	// })

	// t.Run("Sets perticipants to needs-action if response date is changed and there is more than 1 required participants", func(t *testing.T) {
	// 	tentativeStatus := fhir.ParticipationStatusTentative

	// 	savedAppointment.Status = proposedAppointmentStatus
	// 	_, err := appointmentService.UpdateAppointment(*savedAppointment)
	// 	if err != nil {
	// 		t.Fatal(err)
	// 	}

	// 	appointmentRef := "Appointment/" + *savedAppointment.Id
	// 	appointmentRefType := "Appointment"

	// 	actorRef := "Practitioner/" + user.Id
	// 	actorType := "Practitioner"
	// 	newEndTime := time.Now().Add(time.Minute * 15).Format(time.RFC3339)

	// 	appointmentResponse := fhir.AppointmentResponse{
	// 		Appointment: fhir.Reference{
	// 			Reference: &appointmentRef,
	// 			Type:      &appointmentRefType,
	// 		},
	// 		Start: savedAppointment.Start,
	// 		End:   &newEndTime,
	// 		Actor: &fhir.Reference{
	// 			Reference: &actorRef,
	// 			Type:      &actorType,
	// 		},
	// 		ParticipantStatus: tentativeStatus,
	// 	}

	// 	updatedAppointment, err := appointmentService.SaveAppointmentResponse(appointmentResponse, appointmentToken)
	// 	if err != nil {
	// 		t.Fatal(err)
	// 	}

	// 	for i, p := range updatedAppointment.Participant {
	// 		sp := strings.Split(*p.Actor.Reference, "/")
	// 		if len(sp) == 0 {
	// 			t.Fatal("Could not get actor")
	// 		}

	// 		if user.Id == sp[1] {
	// 			needsActionStatus := fhir.ParticipationStatusNeedsAction
	// 			assert.Equal(t, needsActionStatus, updatedAppointment.Participant[i].Status)
	// 		}
	// 	}

	// 	assert.Equal(t, fhir.AppointmentStatusProposed, updatedAppointment.Status)
	// })

	// t.Cleanup(func() {
	// 	if user != nil {
	// 		if err := appointmentKeycloakService.DeleteUser(user.Id, appointmentToken); err != nil {
	// 			t.Error(err)
	// 		}

	// 		_, _, err := fhirService.DeleteResource("Practitioner", user.Id)
	// 		if err != nil {
	// 			t.Fatal(err)
	// 		}

	// 		_, _, err = fhirService.DeleteResource("Appointment", *savedAppointment.Id)
	// 		if err != nil {
	// 			t.Fatal(err)
	// 		}
	// 	}

	// 	if user2 != nil {
	// 		if err := appointmentKeycloakService.DeleteUser(user2.Id, appointmentToken); err != nil {
	// 			t.Error(err)
	// 		}

	// 		_, _, err := fhirService.DeleteResource("Practitioner", user2.Id)
	// 		if err != nil {
	// 			t.Fatal(err)
	// 		}
	// 	}
	// })
}

func TestSaveAppointmentResponseSlotStatus(t *testing.T) {
	// s := setupAppointmentTest(t)
	// defer s(t)

	// fhirService := fhir_rest.FhirService{Client: http.Client{}, FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/"}
	// userRepository := repository.UserRepository{FhirService: fhirService, KeycloakService: appointmentKeycloakService}
	// userService := service.UserService{UserRepository: userRepository}
	// slotRepository := repository.SlotRepository{FhirService: fhirService}
	// slotService := service.SlotService{SlotRepository: slotRepository}
	// extensionService := service.ExtensionService{ExtensionUrl: "http://localhost:8082/extensions"}

	// appointmentRepository := repository.AppointmentRepository{FhirService: fhirService}
	// encounterRepository := repository.EncounterRepository{FhirService: fhirService}
	// organizationRepository := repository.OrganizationRepository{FhirService: fhirService}
	// appointmentService := service.AppointmentService{AppointmentRepository: appointmentRepository, EncounterRepository: encounterRepository, SlotRepository: slotRepository, OrganizationRepository: organizationRepository, UserRepository: userRepository, ExtensionService: extensionService}

	// scheduleRepository := repository.ScheduleRepository{FhirService: fhirService}
	// scheduleService := service.ScheduleService{ScheduleRepository: scheduleRepository}

	// u := map[string]interface{}{
	// 	"role":          "physician",
	// 	"namePrefix":    "Dr.",
	// 	"givenName":     "Test",
	// 	"familyName":    "User 2",
	// 	"email":         "test2@gmail.com",
	// 	"contactNumber": "0911000000",
	// 	"password":      "password",
	// }

	// payload := payload.CreateUserPayload{
	// 	Role:            u["role"].(string),
	// 	NamePrefix:      u["namePrefix"].(string),
	// 	GivenName:       u["givenName"].(string),
	// 	FamilyName:      u["familyName"].(string),
	// 	Email:           u["email"].(string),
	// 	ContactNumber:   u["contactNumber"].(string),
	// 	Password:        u["password"].(string),
	// 	ConfirmPassword: u["password"].(string),
	// }

	// user, _, err := userService.CreateOneUser(payload)
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// proposedAppointmentStatus := fhir.AppointmentStatusProposed

	// reference := "Practitioner/" + user.Id
	// referenceType := "Practitioner"
	// participantRequired := fhir.ParticipantRequiredRequired
	// participantStatus := fhir.ParticipationStatusNeedsAction

	// participant := []fhir.AppointmentParticipant{
	// 	{
	// 		Actor: &fhir.Reference{
	// 			Reference: &reference,
	// 			Type:      &referenceType,
	// 		},
	// 		Required: &participantRequired,
	// 		Status:   participantStatus,
	// 	},
	// }

	// // Create Schedule
	// sc := fhir.Schedule{
	// 	Actor: []fhir.Reference{
	// 		{
	// 			Reference: &reference,
	// 			Type:      &referenceType,
	// 		},
	// 	},
	// }

	// schedule, err := scheduleService.CreateSchedule(sc)
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// // Create slot
	// scheduleRef := "Schedule/" + *schedule.Id
	// scheduleType := "Schedule"
	// extensions, err := extensionService.GetExtensions()
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// extUrl := extensions["EXT_SLOT_APPOINTMENTS_LIMIT"].(string)
	// appointmentsLimit := 1

	// start := time.Now().Format(time.RFC3339)
	// end := time.Now().Format(time.RFC3339)

	// sl := fhir.Slot{
	// 	Start:  start,
	// 	End:    end,
	// 	Status: fhir.SlotStatusFree,
	// 	Schedule: fhir.Reference{
	// 		Reference: &scheduleRef,
	// 		Type:      &scheduleType,
	// 	},
	// 	Extension: []fhir.Extension{
	// 		{
	// 			Url:          extUrl,
	// 			ValueInteger: &appointmentsLimit,
	// 		},
	// 	},
	// }

	// slot, err := slotService.CreateSlot(sl)
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// slotReference := "Slot/" + *slot.Id
	// slotType := "Slot"
	// appointment := fhir.Appointment{
	// 	Status:      proposedAppointmentStatus,
	// 	Participant: participant,
	// 	Start:       &start,
	// 	End:         &end,
	// 	Slot: []fhir.Reference{
	// 		{
	// 			Reference: &slotReference,
	// 			Type:      &slotType,
	// 		},
	// 	},
	// }

	// savedAppointment, err := appointmentService.CreateAppointment(appointment)
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// t.Run("Sets slot status to tentative", func(t *testing.T) {
	// 	slotId := strings.Split(*savedAppointment.Slot[0].Reference, "/")[1]

	// 	slot, err := slotService.GetOneSlot(slotId)
	// 	if err != nil {
	// 		t.Fatal(err)
	// 	}

	// 	assert.Equal(t, fhir.SlotStatusBusyTentative, slot.Status)
	// })

	// // t.Run("Sets appointment to booked if all participants have accepted", func(t *testing.T) {
	// // 	acceptedStatus := fhir.ParticipationStatusAccepted
	// // 	updatedAppointment, err := appointmentService.SaveAppointmentResponse(*savedAppointment.Id, *user.ID, acceptedStatus, appointmentToken)
	// // 	if err != nil {
	// // 		t.Fatal(err)
	// // 	}

	// // 	for i, p := range updatedAppointment.Participant {
	// // 		sp := strings.Split(*p.Actor.Reference, "/")
	// // 		if len(sp) == 0 {
	// // 			t.Fatal("Could not get actor")
	// // 		}

	// // 		if *user.ID == sp[1] {
	// // 			assert.Equal(t, acceptedStatus, updatedAppointment.Participant[i].Status)
	// // 		}
	// // 	}

	// // 	assert.Equal(t, fhir.AppointmentStatusBooked, updatedAppointment.Status)
	// // })

	// t.Cleanup(func() {
	// 	if user != nil {
	// 		if err := appointmentKeycloakService.DeleteUser(user.Id, appointmentToken); err != nil {
	// 			t.Error(err)
	// 		}

	// 		_, _, err := fhirService.DeleteResource("Practitioner", user.Id)
	// 		if err != nil {
	// 			t.Fatal(err)
	// 		}

	// 		_, _, err = fhirService.DeleteResource("Appointment", *savedAppointment.Id)
	// 		if err != nil {
	// 			t.Fatal(err)
	// 		}

	// 		_, _, err = fhirService.DeleteResource("Slot", *slot.Id)
	// 		if err != nil {
	// 			t.Fatal(err)
	// 		}

	// 		_, _, err = fhirService.DeleteResource("Schedule", *schedule.Id)
	// 		if err != nil {
	// 			t.Fatal(err)
	// 		}
	// 	}
	// })
}
