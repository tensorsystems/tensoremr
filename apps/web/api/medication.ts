import axios from "axios";
import { Condition, Medication } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createMedication = (data: Condition) => {
    return axios.post(`${FHIR_URL}/Medication`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}

export const getMedications = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/Medication?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getMedication = (MedicationId: string) => {
  return axios.get(`${FHIR_URL}/Medication/${MedicationId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateMedication = (id: string, data: Medication) => {
  return axios.put(`${FHIR_URL}/Medication/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}

