import axios from "axios";
import { Condition, MedicationAdministration } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createMedicationAdministration = (data: Condition) => {
    return axios.post(`${FHIR_URL}/MedicationAdministration`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}

export const getMedicationAdministrations = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/MedicationAdministration?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getMedicationAdministration = (MedicationAdministrationId: string) => {
  return axios.get(`${FHIR_URL}/MedicationAdministration/${MedicationAdministrationId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateMedicationAdministration = (id: string, data: MedicationAdministration) => {
  return axios.put(`${FHIR_URL}/MedicationAdministration/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}