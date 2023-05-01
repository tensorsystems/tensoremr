package payload

import "github.com/samply/golang-fhir-models/fhir-models/fhir"

type CreateUserPayload struct {
	NamePrefix      string  `json:"namePrefix"`
	GivenName       string  `json:"givenName"`
	FamilyName      string  `json:"familyName"`
	Email           string  `json:"email"`
	ContactNumber   string  `json:"contactNumber"`
	Password        string  `json:"password"`
	ConfirmPassword string  `json:"confirmPassword"`
	Role            string  `json:"role"`
	ProfilePicture  *string `json:"profilePicture"`
	Signature       *string `json:"signature"`
}

type UpdateUserPayload struct {
	ID              string  `json:"id"`
	NamePrefix      string  `json:"namePrefix"`
	GivenName       string  `json:"givenName"`
	FamilyName      string  `json:"familyName"`
	Email           string  `json:"email"`
	ContactNumber   string  `json:"contactNumber"`
	Enabled         bool    `json:"enabled"`
	Password        string  `json:"password"`
	Role            string  `json:"role"`
	ConfirmPassword string  `json:"confirmPassword"`
	ProfilePicture  *string `json:"profilePicture"`
	Signature       *string `json:"signature"`
}

type SaveAppointmentResponsePayload struct {
	ParticipationStatus fhir.ParticipationStatus `json:"participationStatus"`
	AppointmentID       string                   `json:"appointmentId"`
	ParticipantID       string                   `json:"participantId"`
}

type CreateEncounterPayload struct {
	Encounter              fhir.Encounter `json:"encounter"`
	ActivityDefinitionName *string        `json:"activityDefinitionName"`
	RequesterID            *string        `json:"requesterId"`
	CareTeams              []string       `json:"careTeams"`
}
