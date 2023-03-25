import axios from "axios";
import {  MedicationStatement } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createMedicationStatement = (data: MedicationStatement) => {
    return axios.post(`${FHIR_URL}/MedicationStatement`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}

export const getMedicationStatements = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/MedicationStatement?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getMedicationStatement = (MedicationStatementId: string) => {
  return axios.get(`${FHIR_URL}/MedicationStatement/${MedicationStatementId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateMedicationStatement = (id: string, data: MedicationStatement) => {
  return axios.put(`${FHIR_URL}/MedicationStatement/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}