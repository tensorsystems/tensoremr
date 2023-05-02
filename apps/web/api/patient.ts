import axios from "axios";
import { Patient } from "fhir/r4";
import {  FHIR_URL } from ".";

export const getPatient = (id: string) => {
  return axios.get(`${FHIR_URL}/Patient/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const createPatient = (data: Patient) => {
  return axios.post(`${process.env.NX_PUBLIC_APP_SERVER_URL}/patients`, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const updatePatient = (data: Patient) => {
  return axios.put(`${FHIR_URL}/Patient/${data.id}`, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
}

export const searchPatients = (params: any) => {
  return axios.get(`${FHIR_URL}/Patient?${params}`,  {
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
}