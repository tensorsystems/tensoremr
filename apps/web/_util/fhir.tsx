import { AppointmentParticipant, Patient } from "fhir/r4";

export const getPatientMrn = (patient: Patient) => {
  return patient.identifier?.find(
    (e) => e.type.text === "Medical record number"
  )?.value;
};

export const getPatientName = (patient: Patient) => {
  return patient.name
    .map((e) => `${e.given.join(", ")} ${e.family}`)
    .join(", ");
};

export const getPatientFromAppointmentParticipants = (a: AppointmentParticipant[]) => {
    return a.find((e) => e.actor.type === "Practitioner")
}
