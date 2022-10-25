// Generated using pocketbase-typegen

export enum Collections {
	Profiles = "profiles",
	Tests = "tests",
	Patients = "patients",
}

export type ProfilesRecord = {
	userId: string;
	name?: string;
	avatar?: string;
	role?: string;
}

export type TestsRecord = {
	test?: string;
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
	mrn: number;
	middleName?: string;
	nameTitle?: string;
	houseNumber?: string;
}