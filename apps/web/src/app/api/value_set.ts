import axios from "axios";
import { auth } from "./auth";

export const getOrganizationTypes = () => {
  return axios.get(`${import.meta.env.VITE_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/organization-type`, {auth})
}

export const getAppointmentReasons = () => {
  return axios.get(`${import.meta.env.VITE_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v2-0276`, {auth})
}

export const getSlotStatus = () => {
  return axios.get(`${import.meta.env.VITE_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/slotstatus`, {auth})
}