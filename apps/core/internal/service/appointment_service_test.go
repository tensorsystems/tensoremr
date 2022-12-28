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
	"net/http"
	"strings"
	"testing"
	"time"

	"github.com/Nerzal/gocloak/v12"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

var appointmentKeycloakService service.KeycloakService
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

	appointmentKeycloakService = service.KeycloakService{
		Client: client,
		Realm:  "TensorEMR",
	}

	return func(t *testing.T) {}
}

func TestSaveAppointmentResponse(t *testing.T) {
	s := setupAppointmentTest(t)
	defer s(t)

	fhirService := service.FhirService{Client: http.Client{}, FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/"}
	userService := service.UserService{KeycloakService: appointmentKeycloakService, FhirService: fhirService}
	appointmentService := service.AppointmentService{UserService: userService, FhirService: fhirService}

	u := map[string]interface{}{
		"accountType":   "physician",
		"namePrefix":    "Dr.",
		"givenName":     "Test",
		"familyName":    "User 2",
		"email":         "test2@gmail.com",
		"contactNumber": "0911000000",
		"password":      "password",
	}

	payload := payload.CreateUserPayload{
		AccountType:     u["accountType"].(string),
		NamePrefix:      u["namePrefix"].(string),
		GivenName:       u["givenName"].(string),
		FamilyName:      u["familyName"].(string),
		Email:           u["email"].(string),
		ContactNumber:   u["contactNumber"].(string),
		Password:        u["password"].(string),
		ConfirmPassword: u["password"].(string),
	}

	user, err := userService.CreateOneUser(payload, appointmentToken)
	if err != nil {
		t.Fatal(err)
	}

	proposedAppointmentStatus := fhir.AppointmentStatusProposed

	reference := "Practitioner/" + *user.ID
	referenceType := "Practitioner"
	participantRequired := fhir.ParticipantRequiredRequired
	participantStatus := fhir.ParticipationStatusNeedsAction

	participant := []fhir.AppointmentParticipant{
		{
			Actor: &fhir.Reference{
				Reference: &reference,
				Type:      &referenceType,
			},
			Required: &participantRequired,
			Status:   participantStatus,
		},
	}

	start := time.Now().Format(time.RFC3339)
	end := time.Now().Format(time.RFC3339)

	appointment := fhir.Appointment{
		Status:      proposedAppointmentStatus,
		Participant: participant,
		Start:       &start,
		End:         &end,
	}

	savedAppointment, err := appointmentService.CreateAppointment(appointment)
	if err != nil {
		t.Fatal(err)
	}

	t.Run("Sets appointment to booked if all participants have accepted", func(t *testing.T) {
		acceptedStatus := fhir.ParticipationStatusAccepted
		updatedAppointment, err := appointmentService.SaveAppointmentResponse(*savedAppointment.Id, *user.ID, acceptedStatus, appointmentToken)
		if err != nil {
			t.Fatal(err)
		}

		for i, p := range updatedAppointment.Participant {
			sp := strings.Split(*p.Actor.Reference, "/")
			if len(sp) == 0 {
				t.Fatal("Could not get actor")
			}

			if *user.ID == sp[1] {
				assert.Equal(t, acceptedStatus, updatedAppointment.Participant[i].Status)
			}
		}

		assert.Equal(t, fhir.AppointmentStatusBooked, updatedAppointment.Status)
	})

	t.Run("Does not change appointment status if all required participants have not accepted", func(t *testing.T) {
		tentativeStatus := fhir.ParticipationStatusTentative
		savedAppointment.Status = proposedAppointmentStatus
		_, err := appointmentService.UpdateAppointment(*savedAppointment)
		if err != nil {
			t.Fatal(err)
		}

		updatedAppointment, err := appointmentService.SaveAppointmentResponse(*savedAppointment.Id, *user.ID, tentativeStatus, appointmentToken)
		if err != nil {
			t.Fatal(err)
		}

		for i, p := range updatedAppointment.Participant {
			sp := strings.Split(*p.Actor.Reference, "/")
			if len(sp) == 0 {
				t.Fatal("Could not get actor")
			}

			if *user.ID == sp[1] {
				assert.Equal(t, tentativeStatus, updatedAppointment.Participant[i].Status)
			}
		}

		assert.Equal(t, fhir.AppointmentStatusProposed, updatedAppointment.Status)
	})

	t.Run("Cancels appointment if all participants decline", func(t *testing.T) {
		declineStatus := fhir.ParticipationStatusDeclined
		savedAppointment.Status = proposedAppointmentStatus
		_, err := appointmentService.UpdateAppointment(*savedAppointment)
		if err != nil {
			t.Fatal(err)
		}

		updatedAppointment, err := appointmentService.SaveAppointmentResponse(*savedAppointment.Id, *user.ID, declineStatus, appointmentToken)
		if err != nil {
			t.Fatal(err)
		}

		for i, p := range updatedAppointment.Participant {
			sp := strings.Split(*p.Actor.Reference, "/")
			if len(sp) == 0 {
				t.Fatal("Could not get actor")
			}

			if *user.ID == sp[1] {
				assert.Equal(t, declineStatus, updatedAppointment.Participant[i].Status)
			}
		}

		assert.Equal(t, fhir.AppointmentStatusCancelled, updatedAppointment.Status)
	})

	t.Cleanup(func() {
		if user != nil {
			if err := appointmentKeycloakService.DeleteUser(*user.ID, appointmentToken); err != nil {
				t.Error(err)
			}

			_, _, err := fhirService.DeleteResource("Practitioner", *user.ID)
			if err != nil {
				t.Fatal(err)
			}

			_, _, err = fhirService.DeleteResource("Appointment", *savedAppointment.Id)
			if err != nil {
				t.Fatal(err)
			}
		}
	})
}
