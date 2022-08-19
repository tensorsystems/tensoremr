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

package model

// ModalityWorklistMessage ...
type ImagingWorklistMessage struct {
	// MSH
	
	EncodingCharacters                  string `hl7:"MSH.2"`   // This field contains four characters in the following order: the component separator, repetition separator, escape character, and subcomponent separator. Recommended values are ^~\& (ASCII 94, 126, 92, and 38, respectively). See Section 2.5.4, "Message delimiters'.
	SendingApplication                  string `hl7:"MSH.3"`   // This field uniquely identifies the sending application among all other applications within the network enterprise. The network enterprise consists of all those applications that participate in the exchange of HL7 messages within the enterprise. Entirely site-defined. User-defined Table 0361- Application is used as the user-defined table of values for the first component.
	SendingFacility                     string `hl7:"MSH.4"`   // This field further describes the sending application, MSH-3 Sending Application. With the promotion of this field to an HD data type, the usage has been broadened to include not just the sending facility but other organizational entities such as a) the organizational entity responsible for sending application; b) the responsible unit; c) a product or vendor's identifier, etc. Entirely site-defined. User-defined Table 0362 - Facility is used as the HL7 identifier for the user-defined table of values for the first component.
	ReceivingApplication                string `hl7:"MSH.5"`   // This field uniquely identifies the receiving application among all other applications within the network enterprise. The network enterprise consists of all those applications that participate in the exchange of HL7 messages within the enterprise. Entirely site-defined User-defined Table 0361- Application is used as the HL7 identifier for the user-defined table of values for the first component.
	ReceivingFacility                   string `hl7:"MSH.6"`   // This field identifies the receiving application among multiple identical instances of the application running on behalf of different organizations. User-defined Table 0362 - Facility is used as the HL7 identifier for the user-defined table of values for the first component. Entirely site-defined.
	TimeOfMessage                       string `hl7:"MSH.7"`   // This field contains the date/time that the sending system created the message. If the time zone is specified, it will be used throughout the message as the default time zone.
	Security                            string `hl7:"MSH.8"`   // This field contains the date/time that the sending system created the message. If the time zone is specified, it will be used throughout the message as the default time zone.
	MessageCode                         string `hl7:"MSH.9.1"` // Specifies the message type code. Refer to HL7 Table 0076– Message Type for valid values.
	TriggerEvent                        string `hl7:"MSH.9.2"` // Specifies the trigger event code. Refer to HL7 Table 0003– Event Type for valid values
	MessageStructure                    string `hl7:"MSH.9.3"` // Specifies the abstract message structure code. Refer to HL7 Table 0354 – Message Structure for valid values.
	MessageControlId                    string `hl7:"MSH.10"`  // This field contains a number or other identifier that uniquely identifies the message. The receiving system echoes this ID back to the sending system in the Message acknowledgment segment (MSA)
	ProcessingId                        string `hl7:"MSH.11"`  // This field is used to decide whether to process the message as defined in HL7 Application (level 7) Processing rules.
	VersionId                           string `hl7:"MSH.12"`  // This field is matched by the receiving system to its own version to be sure the message will be interpreted correctly. Beginning with Version 2.3.1, it has two additional "internationalization" components, for use by HL7 international affiliates. The <internationalization code> is CE data type (using the ISO country codes where appropriate) which represents the HL7 affiliate. The <internal version ID> is used if the HL7 Affiliate has more than a single 'local' version associated with a single US version. The <international version ID> has a CE data type, since the table values vary for each HL7 Affiliate. Refer to HL7 Table 0104 – Version ID for valid values.
	SequenceNumber                      string `hl7:"MSH.13"`  // A non-null value in this field implies that the sequence number protocol is in use. This numeric field is incremented by one for each subsequent value.
	ContinuationPointer                 string `hl7:"MSH.14"`  // This field is used to define continuations in application-specific ways.
	AcceptAcknowledgmentType            string `hl7:"MSH.15"`  // This field identifies the conditions under which accept acknowledgments are required to be returned in response to this message. Required for enhanced acknowledgment mode. Refer to HL7 Table 0155 - Accept/Application Acknowledgment Conditions for valid values.
	ApplicationAcknowledgmentType       string `hl7:"MSH.16"`  // This field contains the conditions under which application acknowledgments are required to be returned in response to this message. Required for enhanced acknowledgment mode. Refer to HL7 Table 0155 - Accept/Application Acknowledgment Conditions for valid values for MSH-15 Accept Acknowledgment Type and MSH-16 Application Acknowledgment Type
	CountryCode                         string `hl7:"MSH.17"`  // This field contains the country of origin for the message. It will be used primarily to specify default elements, such as currency denominations. The values to be used are those of ISO 3166,.4. The ISO 3166 table has three separate forms of the country code: HL7 specifies that the 3-character (alphabetic) form be used for the country code.
	CharacterSet                        string `hl7:"MSH.18"`  // This field contains the character set for the entire message. Refer to HL7 Table 0211 - Alternate Character Sets for valid values.
	PrincipalLanguageOfMessage          string `hl7:"MSH.19"`  // This field contains the principal language of the message. Codes come from ISO 639.
	AlternateCharacterSetHandlingScheme string `hl7:"MSH.20"`  // When any alternative character sets are used (as specified in the second or later iterations of MSH-18 Character Set), and if any special handling scheme is needed, this component is to specify the scheme used, according to HL7 Table 0356- Alternate Character Set Handling Scheme as defined in Chapter 2.C, Code Tables.
	MessageProfileIdentifier            string `hl7:"MSH.21"`  // Sites may use this field to assert adherence to, or reference, a message profile. Message profiles contain detailed explanations of grammar, syntax, and usage for a particular message or set of messages. See section 2B, "Conformance Using Message Profiles".
	SendingResponsibleOrganization      string `hl7:"MSH.22"`  // Business organization that originated and is accountable for the content of the message.
	ReceivingResponsibleOrganization    string `hl7:"MSH.23"`  // Business organization that is the intended receiver of the message and is accountable for acting on the data conveyed by the transaction.
	SendingNetworkAddress               string `hl7:"MSH.24"`  // Identifier of the network location the message was transmitted from. Identified by an OID or text string (e.g., URI). The reader is referred to the "Report from the Joint W3C/IETF URI Planning Interest Group: Uniform Resource Identifiers (URIs), URLs, and Uniform Resource Names (URNs): Clarifications and Recommendations".5
	ReceivingNetworkAddress             string `hl7:"MSH.25"`  // tifier of the network location the message was transmitted to. Identified by an OID or text string (e.g., URL).

	// PID
	PID                                        string `hl7:"PID.1"`      // This field contains the number that identifies this transaction. For the first occurrence of the segment, the sequence number shall be one, for the second occurrence, the sequence number shall be two, etc
	IdNumber                                   string `hl7:"PID.3.1"`    // The value of the identifier itself.
	PatientIdAssigningAuthorityNamespaceId     string `hl7:"PID.3.4.1"`  // The local coded item for the entity. The component intentionally remains associated with the IS data type in v 2.7.
	PatientIdAssigningAuthorityUniversalId     string `hl7:"PID.3.4.2"`  // The HD’s second component, <universal ID> (UID), is a string formatted according to the scheme defined by the third component, <universal ID type> (UID type). The UID is intended to be unique over time within the UID type. It is rigorously defined. Each UID must belong to one of the specifically enumerated schemes for constructing UIDs (defined by the UID type). The UID (second component) must follow the syntactic rules of the particular universal identifier scheme (defined by the third component). Note that these syntactic rules are not defined within HL7 but are defined by the rules of the particular universal identifier scheme (defined by the third component).
	PatientIdAssigningAuthorityUniversalIDType string `hl7:"PID.3.4.3"`  // The third component governs the interpretation of the second component of the HD. If the third component is a known UID refer to HL7 Table 0301 - Universal ID type for valid values, then the second component is a universal ID of that type.
	IdentifierTypeCode                         string `hl7:"PID.3.5"`    // A code corresponding to the type of identifier. As of v2.7, CX.5 Identifier Type Code is required. Refer to HL7 Table 0203 – Identifier Type for suggested values.
	Surname                                    string `hl7:"PID.5.1.1"`  // The atomic element of the person's family name. In most Western usage, this is the person's last name.
	GivenName                                  string `hl7:"PID.5.2"`    // First name.
	DateOfBirth                                string `hl7:"PID.7"`      // This field contains the patient's date and time of birth.
	AdministrativeSex                          string `hl7:"PID.9"`      // This field contains the patient's sex. Refer to User-defined Table 0001 - Administrative Sex for suggested values.
	StreetOrMailingAddress                     string `hl7:"PID.11.1.1"` // This component specifies the street or mailing address of a person or institution. When referencing an institution, this first component is used to specify the institution name. When used in connection with a person, this component specifies the first line of the address.
	City                                       string `hl7:"PID.11.3"`   // This component specifies the city, or district or place where the addressee is located depending upon the national convention for formatting addresses for postal usage.
	StateOrProvince                            string `hl7:"PID.11.4"`   // This component specifies the state or province where the addressee is located. State or province should be represented by the official postal service codes for that country.
	Country                                    string `hl7:"PID.11.6"`   // This component specifies the country where the addressee is located. HL7 specifies that the 3-character (alphabetic) form of ISO 3166 be used for the country code. Refer to HL7 Table 0399 – Country Code for valid values.
	TelecommunicationEquipmentType             string `hl7:"PID.40.3"`   // A code that represents the type of telecommunication equipment. Refer to HL7 Table 0202 - Telecommunication Equipment Type for valid values. This component along with XTN.2 describes the nature of the telecommunication data that follows and is necessary to accurately interpret it.
	PhoneCountryCode                           string `hl7:"PID.40.5"`   // The numeric code assigned by the International Telecommunication Union in standard E.164 to access telephone services in another country. For example, "+1" is the country code for the United States, "+49" is the code for Germany.
	LocalNumber                                string `hl7:"PID.40.7"`   // The numeric code used to contact the called party, exclusive of country and area/city codes. The Local Number is required when, and allowed only if, XTN.4 and XTN.12 are not populated.

	// PV1
	PV1                                      string `hl7:"PV1.1"` // This field contains the number that identifies this transaction. For the first occurrence of the segment, the sequence number shall be one, for the second occurrence, the sequence number shall be two, etc.
	PatientClass                             string `hl7:"PV1.2"` // This field is used by systems to categorize patients by site. It does not have a consistent industry-wide definition. It is subject to site-specific variations. Refer to User-defined Table 0004 - Patient Class for suggested values.
	AttendingDoctorSurname                   string `hl7:"PV1.7.2.1"`
	AttendingDoctorGivenName                 string `hl7:"PV1.7.3"`
	VisitIdNumber                            string `hl7:"PV1.19.1"`
	VisitIdAssigningAuthorityNamespaceId     string `hl7:"PV1.19.4.1"` // The local coded item for the entity. The component intentionally remains associated with the IS data type in v 2.7.
	VisitIdAssigningAuthorityUniversalId     string `hl7:"PV1.19.4.2"` // The HD’s second component, <universal ID> (UID), is a string formatted according to the scheme defined by the third component, <universal ID type> (UID type). The UID is intended to be unique over time within the UID type. It is rigorously defined. Each UID must belong to one of the specifically enumerated schemes for constructing UIDs (defined by the UID type). The UID (second component) must follow the syntactic rules of the particular universal identifier scheme (defined by the third component). Note that these syntactic rules are not defined within HL7 but are defined by the rules of the particular universal identifier scheme (defined by the third component).
	VisitIdAssigningAuthorityUniversalIDType string `hl7:"PV1.19.4.3"` // The third component governs the interpretation of the second component of the HD. If the third component is a known UID refer to HL7 Table 0301 - Universal ID type for valid values, then the second component is a universal ID of that type.
	VisitIdIdentifierTypeCode                string `hl7:"PV1.19.5"`

	// ORC
	OrderControl                  string `hl7:"ORC.1"`
	ORCPlaceOrderEntityIdentifier string `hl7:"ORC.2.1"`
	ORCPlaceOrderNamespaceId      string `hl7:"ORC.2.2"` // The local coded item for the entity. The component intentionally remains associated with the IS data type in v 2.7.
	ORCPlaceOrderUniversalId      string `hl7:"ORC.2.3"` // The HD’s second component, <universal ID> (UID), is a string formatted according to the scheme defined by the third component, <universal ID type> (UID type). The UID is intended to be unique over time within the UID type. It is rigorously defined. Each UID must belong to one of the specifically enumerated schemes for constructing UIDs (defined by the UID type). The UID (second component) must follow the syntactic rules of the particular universal identifier scheme (defined by the third component). Note that these syntactic rules are not defined within HL7 but are defined by the rules of the particular universal identifier scheme (defined by the third component).
	ORCPlaceOrderUniversalIdType  string `hl7:"ORC.2.4"` // The third component governs the interpretation of the second component of the HD. If the third component is a known UID refer to HL7 Table 0301 - Universal ID type for valid values, then the second component is a universal ID of that type.
	OrderStatus                   string `hl7:"ORC.5"`

	// OBR
	OBRID                         string `hl7:"OBR.1"`
	OBRPlaceOrderEntityIdentifier string `hl7:"OBR.2.1"`
	OBRPlaceOrderNamespaceId      string `hl7:"OBR.2.2"` // The local coded item for the entity. The component intentionally remains associated with the IS data type in v 2.7.
	OBRPlaceOrderUniversalId      string `hl7:"OBR.2.3"` // The HD’s second component, <universal ID> (UID), is a string formatted according to the scheme defined by the third component, <universal ID type> (UID type). The UID is intended to be unique over time within the UID type. It is rigorously defined. Each UID must belong to one of the specifically enumerated schemes for constructing UIDs (defined by the UID type). The UID (second component) must follow the syntactic rules of the particular universal identifier scheme (defined by the third component). Note that these syntactic rules are not defined within HL7 but are defined by the rules of the particular universal identifier scheme (defined by the third component).
	OBRPlaceOrderUniversalIdType  string `hl7:"OBR.2.4"` // The third component governs the interpretation of the second component of the HD. If the third component is a known UID refer to HL7 Table 0301 - Universal ID type for valid values, then the second component is a universal ID of that type.
	UniversalServiceIdentifier    string `hl7:"OBR.4"`
	DiagnosticServSectId          string `hl7:"OBR.24"`
	ProcedureCode                 string `hl7:"OBR.44"`

	// IPC
	AccessionIdEntityIdentifier string `hl7:"IPC.1.1"`
	AccessionIdNamespaceId      string `hl7:"IPC.1.2"` // The local coded item for the entity. The component intentionally remains associated with the IS data type in v 2.7.
	AccessionIdUniversalId      string `hl7:"IPC.1.3"` // The HD’s second component, <universal ID> (UID), is a string formatted according to the scheme defined by the third component, <universal ID type> (UID type). The UID is intended to be unique over time within the UID type. It is rigorously defined. Each UID must belong to one of the specifically enumerated schemes for constructing UIDs (defined by the UID type). The UID (second component) must follow the syntactic rules of the particular universal identifier scheme (defined by the third component). Note that these syntactic rules are not defined within HL7 but are defined by the rules of the particular universal identifier scheme (defined by the third component).
	AccessionIdUniversalIdType  string `hl7:"IPC.1.4"` // The third component governs the interpretation of the second component of the HD. If the third component is a known UID refer to HL7 Table 0301 - Universal ID type for valid values, then the second component is a universal ID of that type.

	RequestedProcedureEntityIdentifier string `hl7:"IPC.2.1"`
	RequestedProcedureNamespaceId      string `hl7:"IPC.2.2"` // The local coded item for the entity. The component intentionally remains associated with the IS data type in v 2.7.
	RequestedProcedureUniversalId      string `hl7:"IPC.2.3"` // The HD’s second component, <universal ID> (UID), is a string formatted according to the scheme defined by the third component, <universal ID type> (UID type). The UID is intended to be unique over time within the UID type. It is rigorously defined. Each UID must belong to one of the specifically enumerated schemes for constructing UIDs (defined by the UID type). The UID (second component) must follow the syntactic rules of the particular universal identifier scheme (defined by the third component). Note that these syntactic rules are not defined within HL7 but are defined by the rules of the particular universal identifier scheme (defined by the third component).
	RequestedProcedureUniversalIdType  string `hl7:"IPC.2.4"` // The third component governs the interpretation of the second component of the HD. If the third component is a known UID refer to HL7 Table 0301 - Universal ID type for valid values, then the second component is a universal ID of that type.

	StudyInstanceEntityIdentifier string `hl7:"IPC.3.1"`
	StudyInstanceNamespaceId      string `hl7:"IPC.3.2"` // The local coded item for the entity. The component intentionally remains associated with the IS data type in v 2.7.
	StudyInstanceUniversalId      string `hl7:"IPC.3.3"` // The HD’s second component, <universal ID> (UID), is a string formatted according to the scheme defined by the third component, <universal ID type> (UID type). The UID is intended to be unique over time within the UID type. It is rigorously defined. Each UID must belong to one of the specifically enumerated schemes for constructing UIDs (defined by the UID type). The UID (second component) must follow the syntactic rules of the particular universal identifier scheme (defined by the third component). Note that these syntactic rules are not defined within HL7 but are defined by the rules of the particular universal identifier scheme (defined by the third component).
	StudyInstanceUniversalIdType  string `hl7:"IPC.3.4"` // The third component governs the interpretation of the second component of the HD. If the third component is a known UID refer to HL7 Table 0301 - Universal ID type for valid values, then the second component is a universal ID of that type.

	StudyProcedureStepEntityIdentifier string `hl7:"IPC.4.1"`
	StudyProcedureStepNamespaceId      string `hl7:"IPC.4.2"` // The local coded item for the entity. The component intentionally remains associated with the IS data type in v 2.7.
	StudyProcedureStepUniversalId      string `hl7:"IPC.4.3"` // The HD’s second component, <universal ID> (UID), is a string formatted according to the scheme defined by the third component, <universal ID type> (UID type). The UID is intended to be unique over time within the UID type. It is rigorously defined. Each UID must belong to one of the specifically enumerated schemes for constructing UIDs (defined by the UID type). The UID (second component) must follow the syntactic rules of the particular universal identifier scheme (defined by the third component). Note that these syntactic rules are not defined within HL7 but are defined by the rules of the particular universal identifier scheme (defined by the third component).
	StudyProcedureStepUniversalIdType  string `hl7:"IPC.4.4"` // The third component governs the interpretation of the second component of the HD. If the third component is a known UID refer to HL7 Table 0301 - Universal ID type for valid values, then the second component is a universal ID of that type.

	Modality string `hl7:"IPC.5"`
}
