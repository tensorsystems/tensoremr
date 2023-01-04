import axios from "axios";
import { auth } from "./auth";

export const getOrganizationTypes = (baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/organization-type`, {auth})
}

export const getAppointmentReasons = (baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v2-0276`, {auth})
}

export const getSlotStatus = (baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/slotstatus`, {auth})
}

export const getPracticeCodes = (baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/c80-practice-codes`, {auth})
}

export const getAdministrativeGenders = (baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/administrative-gender`, {auth})
}

export const getMartialStatuses = (baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/marital-status`, {auth})
}

export const getPatientContactRelationships = (baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/patient-contactrelationship`, {auth})
}

export const getEncounterTypes = (baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v3-ActEncounterCode`, {auth})
}

export const getEncounterStatuses = (baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-status`, {auth})
}