import axios from "axios";
import { auth } from "./auth";

export const getOrganizationTypes = () => {
  return axios.get(`${process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/organization-type`, {auth})
}

export const getAppointmentReasons = () => {
  return axios.get(`${process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v2-0276`, {auth})
}

export const getSlotStatus = () => {
  return axios.get(`${process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/slotstatus`, {auth})
}

export const getPracticeCodes = () => {
  return axios.get(`${process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/c80-practice-codes`, {auth})
}

export const getAdministrativeGenders = () => {
  return axios.get(`${process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/administrative-gender`, {auth})
}

export const getMartialStatuses = () => {
  return axios.get(`${process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/marital-status`, {auth})
}

export const getPatientContactRelationships = () => {
  return axios.get(`${process.env.NEXT_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/patient-contactrelationship`, {auth})
}