import axios from "axios";
import { Patient } from "fhir/r4";
import { auth } from "./auth";


export const createPatient = (data: Patient) => {
  return axios.post(`${process.env.NEXT_PUBLIC_FHIR_URL}/Patient`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
}

export const updatePatient = (data: Patient) => {
  return axios.put(`${process.env.NEXT_PUBLIC_FHIR_URL}/Patient/${data.id}`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
}

export const searchPatients = (params: any) => {
  return axios.get(`${process.env.NEXT_PUBLIC_FHIR_URL}/Patient?${params}`,  {
    auth,
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
}