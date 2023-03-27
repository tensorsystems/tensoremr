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

export const getEncounterParticipantTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-participant-type`, {auth})
}

export const getEventStatus = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/event-status`, {auth})
}

export const getProcedureCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/procedure-category`, {auth})
}

export const getProcedureOutcomes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/procedure-outcome`, {auth})
}

export const getConditionSeverity = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/condition-severity`, {auth})
}

export const getConditionStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/condition-clinical`, {auth})
}

export const getConditionVerStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/condition-ver-status`, {auth})
}

export const getConditionCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/condition-category`, {auth})
}

export const getVaccineCodes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/vaccine-code`, {auth})
}

export const getImmunizationStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-status`, {auth})
}

export const getImmunizationOrigins = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-origin`, {auth})
}

export const getImmunizationRoutes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-route`, {auth})
}

export const getImmunizationReasons = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-reason`, {auth})
}

export const getImmunizationFundingSources = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-funding-source`, {auth})
}

export const getImmunizationSites = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-site`, {auth})
}

export const getImmunizationSubpotentReason = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-subpotent-reason`, {auth})
}

export const getAllergyIntoleranceStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/allergyintolerance-clinical`, {auth})
}

export const getAllergyIntoleranceVerStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/allergyintolerance-verification`, {auth})
}

export const getAllergyIntoleranceTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/allergy-intolerance-type`, {auth})
}

export const getAllergyIntoleranceCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/allergy-intolerance-category`, {auth})
}

export const getAllergyIntoleranceCriticalities = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/allergy-intolerance-criticality`, {auth})
}

export const getMedicationStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medication-status`, {auth})
}

export const getMedicationStatementStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medication-statement-status`, {auth})
}

export const getMedicationStatementCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medication-statement-category`, {auth})
}

export const getTimingAbbreviations = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/timing-abbreviation`, {auth})
}

export const getUnitsOfTimes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/units-of-time`, {auth})
}

export const getCareTeamStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/care-team-status`, {auth})
}

export const getRequestStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/request-status`, {auth})
}

export const getRequestPriorities = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/request-priority`, {auth})
}

export const getRequestIntents = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/request-intent`, {auth})
}

export const getMedicationRequestStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medicationrequest-status`, {auth})
}

export const getMedicationRequestIntents = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medicationrequest-intent`, {auth})
}

export const getMedicationRequestCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medicationrequest-category`, {auth})
}

export const getMedicationRequestCourseOfTherapies = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medicationrequest-course-of-therapy`, {auth})
}

export const getDurationUnits = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/duration-units`, {auth})
}

export const getMedicationAdminStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medication-admin-status`, {auth})
}

export const getMedicationAdminCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medication-admin-category`, {auth})
}

export const getFinancialResourceStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/fm-status`, {auth})
}

export const getVisionEyeCodes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/vision-eye-codes`, {auth})
}

export const getVisionBaseCodes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/vision-base-codes`, {auth})
}

export const getVisionProducts = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/vision-product`, {auth})
}
