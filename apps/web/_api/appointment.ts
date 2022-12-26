import axios from "axios";
import { Appointment } from "fhir/r4";
import { auth } from "./auth";

export const createAppointment = (data: Appointment) => {
    return axios.post(`${process.env.NEXT_PUBLIC_FHIR_URL}/Appointment`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

export const searchAppointments = (searchParams?: string) => {
  return axios.get(`${process.env.NEXT_PUBLIC_FHIR_URL}/Appointment?${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}