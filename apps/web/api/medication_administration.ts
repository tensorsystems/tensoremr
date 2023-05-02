import axios from "axios";
import { MedicationAdministration } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";

export const createMedicationAdministration = (data: MedicationAdministration) => {
    return axios.post(`${FHIR_URL}/MedicationAdministration`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}

export const getMedicationAdministrations = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/MedicationAdministration?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getMedicationAdministration = (MedicationAdministrationId: string) => {
  return axios.get(`${FHIR_URL}/MedicationAdministration/${MedicationAdministrationId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateMedicationAdministration = (id: string, data: MedicationAdministration) => {
  return axios.put(`${FHIR_URL}/MedicationAdministration/${id}`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}