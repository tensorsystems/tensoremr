import axios from "axios";
import { Appointment, AppointmentResponse } from "fhir/r4";
import { auth } from "./auth";

export const createAppointment = (data: Appointment) => {
    return axios.post(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/appointments`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

export const saveAppointmentResponse = (data: AppointmentResponse) => {
    return axios.post(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/appointmentResponse`, JSON.stringify(data), {
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