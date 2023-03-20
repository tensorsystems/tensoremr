import axios from "axios";
import { Condition, MedicationRequest } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createMedicationRequest = (data: Condition) => {
    return axios.post(`${FHIR_URL}/MedicationRequest`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}

export const getMedicationRequests = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/MedicationRequest?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getMedicationRequest = (MedicationRequestId: string) => {
  return axios.get(`${FHIR_URL}/MedicationRequest/${MedicationRequestId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateMedicationRequest = (id: string, data: MedicationRequest) => {
  return axios.put(`${FHIR_URL}/MedicationRequest/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}