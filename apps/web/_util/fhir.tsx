import {  Encounter, Identifier, Patient } from "fhir/r4";

export const parsePatientMrn = (patient: Patient) => {
  return patient?.identifier?.find(
    (e) => e.type.text === "Medical record number"
  )?.value;
};

export const parsePatientName = (patient: Patient) => {
  return patient?.name
    .map((e) => `${e.given.join(", ")} ${e.family}`)
    .join(", ");
};

export const parseEncounterId = (identifiers: Identifier[]) => {
  return identifiers?.find(
    (e) => e.type.coding.find((c) => c.code === "ACSN")
  )?.value;
}