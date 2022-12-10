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

package models

import "time"

type CodeSystemConcept struct {
	Code       string `json:"code"`
	Display    string `json:"display"`
	Definition string `json:"definition"`
}

type CodeSystemResponse struct {
	ResourceType string              `json:"resourceType"`
	ID           string              `json:"id"`
	Url          string              `json:"url"`
	Version      string              `json:"version"`
	Name         string              `json:"name"`
	Concept      []CodeSystemConcept `json:"concept"`
}

type Coding struct {
	ID           string `json:"id"`
	System       string `json:"system"`
	Version      string `json:"version"`
	Code         string `json:"code"`
	Display      string `json:"display"`
	UserSelected bool   `json:"userSelected"`
	Definition   string `json:"definition"`
}

type Schedule struct {
	ID              string    `json:"id"`
	Active          bool      `json:"active"`
	ServiceCategory string    `json:"serviceCategory"`
	ServiceType     string    `json:"serviceType"`
	Specialty       string    `json:"specialty"`
	Actor           string    `json:"actor"`
	Recurring       bool      `json:"recurring"`
	Comment         string    `json:"comment"`
	StartPeriod     time.Time `json:"startPeriod"`
	EndPeriod       time.Time `json:"endPeriod"`
}

type ValueSetResponse struct {
	ResourceType string          `json:"resourceType"`
	ID           string          `json:"id"`
	Url          string          `json:"url"`
	Version      string          `json:"version"`
	Name         string          `json:"name"`
	Compose      ValueSetCompose `json:"compose"`
}

type ValueSetCompose struct {
	Include []ValueSetInclude `json:"include"`
}

type ValueSetInclude struct {
	System  string              `json:"system"`
	Concept []CodeSystemConcept `json:"concept"`
}

type Appointment struct {
	CheckInTime            time.Time
	Emergency              bool
	Department             string
	PatientID              string
	PatientName            string
	ProviderID             string
	ProviderName           string
	RoomID                 string
	RoomName               string
	AppointmentStatusID    string
	AppointmentStatusTitle string
	VisitTypeID            string
	VisitTypeTitle         string
	QueueID                string
	QueueName              string
}

type Identifier struct {
	Use      string       `json:"use"`
	Type     string       `json:"type"`
	System   string       `json:"system"`
	Value    string       `json:"value"`
	Assigner []Identifier `json:"assigner"`
}

type Reference struct {
	Reference  string     `json:"reference"`
	Type       string     `json:"type"`
	Display    string     `json:"display"`
	Identifier Identifier `json:"identifier"`
}

type HumanName struct {
	Use    string `json:"use"`
	Text   string `json:"text"`
	Family string `json:"family"`
	Given  string `json:"given"`
	Prefix string `json:"prefix"`
	Suffix string `json:"suffix"`
}

type ContactPoint struct {
	System string `json:"system"`
	Value  string `json:"value"`
	Use    string `json:"use"`
	Rank   int    `json:"rank"`
}

type Address struct {
	Use        string   `json:"use"`
	Type       string   `json:"type"`
	Text       string   `json:"text"`
	Line       []string `json:"line"`
	City       string   `json:"city"`
	District   string   `json:"district"`
	State      string   `json:"state"`
	PostalCode string   `json:"postalCode"`
	Country    string   `json:"country"`
}

type Attachment struct {
	ContentType string `json:"contentType"`
	Language    string `json:"language"`
	Data        string `json:"data"`
	Url         string `json:"url"`
	Size        int    `json:"size"`
	Hash        string `json:"hash"`
	Title       string `json:"title"`
}

type Person struct {
	Identifier           Identifier     `json:"identifier"`
	Name                 HumanName      `json:"name"`
	Telecom              []ContactPoint `json:"telecom"`
	Gender               string         `json:"gender"`
	BirthDate            time.Time      `json:"birthDate"`
	ManagingOrganization Reference      `json:"ManagingOrganization"`
	Address              Address        `json:"address"`
	Photo                Attachment     `json:"photo"`
	Active               bool           `json:"active"`
	Link                 PersonLink     `json:"link"`
}

type PersonLink struct {
	Target    Reference `json:"target"`
	Assurance string    `json:"assurance"`
}

type Practitioner struct {
	ID            string                    `json:"id"`
	Identifier    Identifier                `json:"identifier"`
	Active        bool                      `json:"active"`
	Name          HumanName                 `json:"name"`
	Telecom       []ContactPoint            `json:"telecom"`
	Address       []Address                 `json:"address"`
	Gender        string                    `json:"gender"`
	BirthDate     time.Time                 `json:"birthDate"`
	Photo         Attachment                `json:"photo"`
	Qualification PractitionerQualification `json:"qualification"`
}

type PractitionerQualification struct {
	Identifier Identifier `json:"identifier"`
	Code       string     `json:"code"`
	Period     Period     `json:"period"`
}

type Period struct {
	Start time.Time `json:"start"`
	End   time.Time `json:"end"`
}
