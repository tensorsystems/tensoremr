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

package service

import (
	"encoding/json"
	"errors"
	"os"
	"strings"
	"time"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

type AppointmentService struct {
	AppointmentRepository  repository.AppointmentRepository
	EncounterRepository    repository.EncounterRepository
	SlotRepository         repository.SlotRepository
	OrganizationRepository repository.OrganizationRepository
	UserService            UserService
	ExtensionService       ExtensionService
}

func NewAppointmentService(appointmentRepository repository.AppointmentRepository, encounterRepository repository.EncounterRepository, slotRepository repository.SlotRepository, organizationRepository repository.OrganizationRepository, userService UserService, extensionService ExtensionService) AppointmentService {
	return AppointmentService{
		AppointmentRepository:  appointmentRepository,
		EncounterRepository:    encounterRepository,
		SlotRepository:         slotRepository,
		OrganizationRepository: organizationRepository,
		ExtensionService:       extensionService,
		UserService:            userService,
	}
}

// GetAppointment ...
func (a *AppointmentService) GetAppointment(ID string) (*fhir.Appointment, error) {
	appointment, err := a.AppointmentRepository.GetAppointment(ID)
	if err != nil {
		return nil, err
	}

	return appointment, nil
}

// CreateAppointment ...
func (a *AppointmentService) CreateAppointment(p fhir.Appointment) (*fhir.Appointment, error) {
	// Get slot
	slotId := strings.Split(*p.Slot[0].Reference, "/")[1]
	slot, err := a.SlotRepository.GetOneSlot(slotId)
	if err != nil {
		return nil, err
	}

	// Check if slot is free
	if slot.Status != fhir.SlotStatusFree {
		return nil, errors.New("this slot is not free and cannot be used at the moment")
	}

	// If start/end time is not set, use minutesDuration
	if p.Start == nil && p.End == nil {
		if p.MinutesDuration == nil {
			return nil, errors.New("either start/end or minutes duration is required")
		}

		start, err := time.Parse(time.RFC3339, slot.Start)
		if err != nil {
			return nil, err
		}

		end := start.Add(time.Minute * time.Duration(*p.MinutesDuration)).Format(time.RFC3339)

		p.Start = &slot.Start
		p.End = &end
	}

	appointment, err := a.AppointmentRepository.CreateAppointment(p)
	if err != nil {
		return nil, err
	}

	// Create Encounter
	encounterPlannedStatus := fhir.EncounterStatusPlanned
	var subjectId string
	var encounterParticipant []fhir.EncounterParticipant

	for _, participant := range appointment.Participant {
		if *participant.Actor.Type == "Patient" {
			subjectId = strings.Split(*participant.Actor.Reference, "/")[1]
		}

		if *participant.Actor.Type == "Practitioner" {
			ref := "Practitioner/" + strings.Split(*participant.Actor.Reference, "/")[1]
			refType := "Practitioner"

			encounterParticipant = append(encounterParticipant, fhir.EncounterParticipant{
				Type: participant.Type,
				Individual: &fhir.Reference{
					Reference: &ref,
					Type:      &refType,
				},
			})
		}
	}

	organization, err := a.OrganizationRepository.GetOrganizationByIdentifier(os.Getenv("ORGANIZATION_ID"))
	if err != nil {
		return nil, err
	}

	var organizationId string
	if len(organization.Entry) > 0 {
		bytes, err := organization.Entry[0].Resource.MarshalJSON()
		if err != nil {
			return nil, err
		}

		resource := make(map[string]interface{})
		if err := json.Unmarshal(bytes, &resource); err != nil {
			return nil, err
		}

		organizationId = resource["id"].(string)
	}

	organizationRef := "Organization/" + organizationId
	organizationRefType := "Organization"

	subjectRef := "Patient/" + subjectId
	subjectRefType := "Patient"

	appointmentRef := "Appointment/" + *appointment.Id
	appointmentRefType := "Appointment"

	classSystem := "http://terminology.hl7.org/ValueSet/v3-ActEncounterCode"
	classVersion := "2.0.0"
	classCode := "PRENC"
	classDisplay := "pre-admission"

	encounter := fhir.Encounter{
		Status: encounterPlannedStatus,
		Subject: &fhir.Reference{
			Reference: &subjectRef,
			Type:      &subjectRefType,
		},
		Participant: encounterParticipant,
		Appointment: []fhir.Reference{
			{
				Reference: &appointmentRef,
				Type:      &appointmentRefType,
			},
		},
		ServiceProvider: &fhir.Reference{
			Reference: &organizationRef,
			Type:      &organizationRefType,
		},
		Class: fhir.Coding{
			System:  &classSystem,
			Version: &classVersion,
			Code:    &classCode,
			Display: &classDisplay,
		},
	}

	// Create encounter
	_, err = a.EncounterRepository.CreateEncounter(encounter)
	if err != nil {
		return nil, err
	}

	// Update slot status
	extensions, err := a.ExtensionService.GetExtensions()
	if err != nil {
		return nil, err
	}

	extUrl := extensions["EXT_SLOT_APPOINTMENTS_LIMIT"].(string)

	totalAppointments, err := a.AppointmentRepository.GetBySlot_Count(slotId)
	if err != nil {
		return nil, err
	}

	limitReached := false
	for _, ext := range slot.Extension {
		if ext.Url == extUrl {
			appointmentLimit := ext.ValueInteger

			total := int(*totalAppointments)

			if *appointmentLimit == total {
				limitReached = true
			}
		}
	}

	if limitReached {
		// Set to busy tentative
		slot.Status = fhir.SlotStatusBusyTentative
		_, err := a.SlotRepository.UpdateSlot(*slot)
		if err != nil {
			return nil, err
		}
	}

	return appointment, nil
}

// UpdateAppointment ...
func (a *AppointmentService) UpdateAppointment(p fhir.Appointment) (*fhir.Appointment, error) {
	appointment, err := a.AppointmentRepository.UpdateAppointment(p)
	if err != nil {
		return nil, err
	}

	return appointment, nil
}

// CreateAppointmentResponse ...
func (a *AppointmentService) CreateAppointmentResponse(p fhir.AppointmentResponse) (*fhir.AppointmentResponse, error) {
	appointment, err := a.AppointmentRepository.CreateAppointmentResponse(p)
	if err != nil {
		return nil, err
	}

	return appointment, nil
}

// SaveAppointmentResponse ...
func (a *AppointmentService) SaveAppointmentResponse(response fhir.AppointmentResponse, accessToken string) (*fhir.Appointment, error) {
	participantID := strings.Split(*response.Actor.Reference, "/")[1]
	appointmentID := strings.Split(*response.Appointment.Reference, "/")[1]
	status := response.ParticipantStatus

	// Create appointment response
	_, err := a.AppointmentRepository.CreateAppointmentResponse(response)
	if err != nil {
		return nil, err
	}

	// Get user
	user, _, err := a.UserService.GetOneUser(participantID)
	if err != nil {
		return nil, err
	}

	// Get appointment
	appointment, err := a.AppointmentRepository.GetAppointment(appointmentID)
	if err != nil {
		return nil, err
	}

	// Check if new time is set by participant
	if *response.Start != *appointment.Start || *response.End != *appointment.End {
		practitionerType := "Practitioner"

		numParticipants := 0
		for i := range appointment.Participant {
			if *appointment.Participant[i].Actor.Type == practitionerType && *appointment.Participant[i].Required == fhir.ParticipantRequiredRequired {
				numParticipants = numParticipants + 1
			}
		}

		if numParticipants == 1 {
			// Set single participant status
			for i, p := range appointment.Participant {
				t := strings.Split(*p.Actor.Reference, "/")
				if len(t) == 0 {
					return nil, errors.New("could not get actor")
				}

				if user.Id == t[1] {
					appointment.Participant[i].Status = status
				}
			}
		} else {
			// Action needed by all participants
			for i := range appointment.Participant {
				if appointment.Participant[i].Actor.Type == &practitionerType {
					appointment.Participant[i].Status = fhir.ParticipationStatusNeedsAction
				}
			}
		}
	} else {
		// Set single participant status
		for i, p := range appointment.Participant {
			t := strings.Split(*p.Actor.Reference, "/")
			if len(t) == 0 {
				return nil, errors.New("could not get actor")
			}

			if user.Id == t[1] {
				appointment.Participant[i].Status = status
			}
		}
	}

	appointment, err = a.AppointmentRepository.UpdateAppointment(*appointment)
	if err != nil {
		return nil, err
	}

	allAccepted := true
	for _, p := range appointment.Participant {
		if p.Required != nil {
			if *p.Required == fhir.ParticipantRequiredRequired && p.Status != fhir.ParticipationStatusAccepted {
				allAccepted = false
			}
		}
	}

	if allAccepted {
		appointment.Status = fhir.AppointmentStatusBooked
		appointment, err = a.AppointmentRepository.UpdateAppointment(*appointment)
		if err != nil {
			return nil, err
		}

		// Update slot status
		if len(appointment.Slot) > 0 {
			slotId := strings.Split(*appointment.Slot[0].Reference, "/")[1]

			slot, err := a.SlotRepository.GetOneSlot(slotId)
			if err != nil {
				return nil, err
			}

			if slot.Status == fhir.SlotStatusBusyTentative {
				slot.Status = fhir.SlotStatusBusy
				_, err := a.SlotRepository.UpdateSlot(*slot)
				if err != nil {
					return nil, err
				}
			}
		}
	}

	declined := false
	for _, p := range appointment.Participant {
		if p.Required != nil {
			if *p.Required == fhir.ParticipantRequiredRequired && p.Status == fhir.ParticipationStatusDeclined {
				declined = true
			}
		}
	}

	if declined {
		appointment.Status = fhir.AppointmentStatusCancelled
		appointment, err = a.AppointmentRepository.UpdateAppointment(*appointment)
		if err != nil {
			return nil, err
		}

		// Update slot status
		if len(appointment.Slot) > 0 {
			slotId := strings.Split(*appointment.Slot[0].Reference, "/")[1]

			slot, err := a.SlotRepository.GetOneSlot(slotId)
			if err != nil {
				return nil, err
			}

			if slot.Status == fhir.SlotStatusBusyTentative {
				slot.Status = fhir.SlotStatusFree
				_, err := a.SlotRepository.UpdateSlot(*slot)
				if err != nil {
					return nil, err
				}
			}
		}
	}

	return appointment, nil
}
