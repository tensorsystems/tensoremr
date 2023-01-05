import axios from "axios";
import { auth } from "./auth";

export const getOrganizationTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/organization-type`, {auth})
}

export const getAppointmentReasons = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v2-0276`, {auth})
}

export const getSlotStatus = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/slotstatus`, {auth})
}

export const getPracticeCodes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/c80-practice-codes`, {auth})
}

export const getAdministrativeGenders = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/administrative-gender`, {auth})
}

export const getMartialStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/marital-status`, {auth})
}

export const getPatientContactRelationships = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/patient-contactrelationship`, {auth})
}

export const getEncounterTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v3-ActEncounterCode`, {auth})
}

export const getEncounterStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-status`, {auth})
}

export const getEncounterReasons = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-reason`, {auth})
}

export const getEncounterAdmitSources = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-admit-source`, {auth})
}

export const getEncounterDiets = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-diet`, {auth})
}

export const getEncounterSpecialCourtesies = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-special-courtesy`, {auth})
}

export const getEncounterSpecialArrangements = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-special-arrangements`, {auth})
}

export const getLocationPhysicalTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/location-physical-type`, {auth})
}

export const getLocationOperationalStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v2-0116`, {auth})
}

export const getLocationStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/location-status`, {auth})
}

export const getLocationTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v3-ServiceDeliveryLocationRoleType`, {auth})
}

export const getDaysOfWeek = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/days-of-week`, {auth})
}




