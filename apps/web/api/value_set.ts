import axios from "axios";

export const getOrganizationTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/organization-type`)
}

export const getAppointmentReasons = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v2-0276`)
}

export const getSlotStatus = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/slotstatus`)
}

export const getPracticeCodes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/c80-practice-codes`)
}

export const getAdministrativeGenders = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/administrative-gender`)
}

export const getMartialStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/marital-status`)
}

export const getPatientContactRelationships = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/patient-contactrelationship`)
}

export const getEncounterTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v3-ActEncounterCode`)
}

export const getEncounterStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-status`)
}

export const getEncounterReasons = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-reason`)
}

export const getEncounterAdmitSources = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-admit-source`)
}

export const getEncounterDiets = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-diet`)
}

export const getEncounterSpecialCourtesies = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-special-courtesy`)
}

export const getEncounterSpecialArrangements = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-special-arrangements`)
}

export const getLocationPhysicalTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/location-physical-type`)
}

export const getLocationOperationalStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v2-0116`)
}

export const getLocationStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/location-status`)
}

export const getLocationTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://terminology.hl7.org/ValueSet/v3-ServiceDeliveryLocationRoleType`)
}

export const getDaysOfWeek = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/days-of-week`)
}

export const getEncounterParticipantTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/encounter-participant-type`)
}

export const getEventStatus = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/event-status`)
}

export const getProcedureCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/procedure-category`)
}

export const getProcedureOutcomes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/procedure-outcome`)
}

export const getConditionSeverity = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/condition-severity`)
}

export const getConditionStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/condition-clinical`)
}

export const getConditionVerStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/condition-ver-status`)
}

export const getConditionCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/condition-category`)
}

export const getVaccineCodes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/vaccine-code`)
}

export const getImmunizationStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-status`)
}

export const getImmunizationOrigins = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-origin`)
}

export const getImmunizationRoutes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-route`)
}

export const getImmunizationReasons = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-reason`)
}

export const getImmunizationFundingSources = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-funding-source`)
}

export const getImmunizationSites = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-site`)
}

export const getImmunizationSubpotentReason = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/immunization-subpotent-reason`)
}

export const getAllergyIntoleranceStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/allergyintolerance-clinical`)
}

export const getAllergyIntoleranceVerStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/allergyintolerance-verification`)
}

export const getAllergyIntoleranceTypes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/allergy-intolerance-type`)
}

export const getAllergyIntoleranceCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/allergy-intolerance-category`)
}

export const getAllergyIntoleranceCriticalities = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/allergy-intolerance-criticality`)
}

export const getMedicationStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medication-status`)
}

export const getMedicationStatementStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medication-statement-status`)
}

export const getMedicationStatementCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medication-statement-category`)
}

export const getTimingAbbreviations = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/timing-abbreviation`)
}

export const getUnitsOfTimes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/units-of-time`)
}

export const getCareTeamStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/care-team-status`)
}

export const getRequestStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/request-status`)
}

export const getRequestPriorities = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/request-priority`)
}

export const getRequestIntents = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/request-intent`)
}

export const getMedicationRequestStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medicationrequest-status`)
}

export const getMedicationRequestIntents = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medicationrequest-intent`)
}

export const getMedicationRequestCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medicationrequest-category`)
}

export const getMedicationRequestCourseOfTherapies = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medicationrequest-course-of-therapy`)
}

export const getDurationUnits = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/duration-units`)
}

export const getMedicationAdminStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medication-admin-status`)
}

export const getMedicationAdminCategories = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/medication-admin-category`)
}

export const getFinancialResourceStatuses = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/fm-status`)
}

export const getVisionEyeCodes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/vision-eye-codes`)
}

export const getVisionBaseCodes = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/vision-base-codes`)
}

export const getVisionProducts = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/vision-product`)
}
