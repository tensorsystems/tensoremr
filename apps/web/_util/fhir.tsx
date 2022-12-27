import {  Patient } from "fhir/r4";

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
