// Generated using pocketbase-typegen

export enum Collections {
	Profiles = "profiles",
	Patients = "patients",
	References = "references",
	Identifier = "identifier",
	ContactPoints = "contact_points",
	Address = "address",
	Attachment = "attachment",
	HumanNames = "human_names",
	Persons = "persons",
	Organization = "organization",
	Contacts = "contacts",
	PractitionerRole = "practitioner_role",
	Codings = "codings",
	CodeableConcepts = "codeable_concepts",
	Schedules = "schedules",
	Slots = "slots",
}

export type ProfilesRecord = {
	userId: string;
	avatar?: string;
	role: string;
	active?: boolean;
	address?: string;
	gender?: string;
	birthDate?: string;
	familyName: string;
	givenName: string;
	namePrefix?: string;
	nameSuffix?: string;
	telecom?: string;
}

export type PatientsRecord = {
	firstName: string;
	lastName: string;
	gender: string;
	phoneNumber: string;
	phoneNumber2?: string;
	homePhoneNumber?: string;
	email: string;
	dateOfBirth: string;
	identificationNo?: string;
	identificationType?: string;
	country: string;
	city?: string;
	subCity?: string;
	state?: string;
	zone?: string;
	emergencyContactName?: string;
	emergencyContactRelationship?: string;
	emergencyContactPhone?: string;
	emergencyContactMemo?: string;
	memo?: string;
	status?: string;
	occupation?: string;
	martialStatus?: string;
	streetAddress?: string;
	streetAddress2?: string;
	postalZipCode?: string;
	mrn: string;
	middleName?: string;
	nameTitle?: string;
	houseNumber?: string;
}

export type ReferencesRecord = {
	reference: string;
	display?: string;
	identifier?: string;
	type: string;
}

export type IdentifierRecord = {
	use?: string;
	type?: string;
	system?: string;
	value?: string;
	assigner?: string;
}

export type ContactPointsRecord = {
	system?: string;
	value?: string;
	use?: string;
	rank?: number;
}

export type AddressRecord = {
	use?: string;
	type?: string;
	text?: string;
	line?: string;
	city?: string;
	district?: string;
	state?: string;
	postalCode?: string;
	country?: string;
	line2?: string;
}

export type AttachmentRecord = {
	contentType?: string;
	language?: string;
	data?: string;
	url?: string;
	size?: number;
	hash?: string;
	title?: string;
}

export type HumanNamesRecord = {
	use?: string;
	text?: string;
	family?: string;
	given?: string;
	prefix?: string;
	suffix?: string;
}

export type PersonsRecord = {
	identifier?: string;
	name?: string;
	telecom?: string;
	gender?: string;
	birthDate?: string;
	managingOrganization?: string;
	address?: string;
	photo?: string;
	active?: boolean;
	target?: string;
}

export type OrganizationRecord = {
	identifier?: string;
	active?: boolean;
	type?: string;
	name: string;
	alias?: string;
	telecom?: string;
	address?: string;
	partOf?: string;
	contact?: string;
	primary: boolean;
	email?: string;
}

export type ContactsRecord = {
	purpose?: string;
	name?: string;
	telecom?: string;
	address?: string;
}

export type PractitionerRoleRecord = {
	identifier?: string;
	active?: boolean;
	practitioner?: string;
	organization?: string;
	code?: string;
	speciality?: string;
}

export type CodingsRecord = {
	system?: string;
	version?: string;
	code: string;
	display?: string;
	userSelected?: boolean;
	definition?: string;
}

export type CodeableConceptsRecord = {
	coding?: string;
	text?: string;
}

export type SchedulesRecord = {
	identifier?: string;
	active?: boolean;
	serviceCategory?: string;
	serviceType?: string;
	specialty?: string;
	actor: string;
	recurring?: boolean;
	comment?: string;
	startPeriod: string;
	endPeriod: string;
	serviceCategoryDisplay?: string;
	serviceTypeDisplay?: string;
	specialtyDisplay?: string;
	actorDisplay?: string;
	resourceType?: string;
}

export type SlotsRecord = {
	identifier?: string;
	serviceCategory?: string;
	serviceType?: string;
	specialty?: string;
	appointmentType?: string;
	schedule: string;
	status: string;
	start: string;
	end: string;
	overbooked?: boolean;
	comment?: string;
	serviceCategoryDisplay?: string;
	serviceTypeDisplay?: string;
	specialtyDisplay?: string;
	appointmentTypeDisplay?: string;
	statusDisplay?: string;
}