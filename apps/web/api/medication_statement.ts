import axios from "axios";
import {  MedicationStatement } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";

export const createMedicationStatement = (data: MedicationStatement) => {
    return axios.post(`${FHIR_URL}/MedicationStatement`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}

export const getMedicationStatements = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/MedicationStatement?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getMedicationStatement = (MedicationStatementId: string) => {
  return axios.get(`${FHIR_URL}/MedicationStatement/${MedicationStatementId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateMedicationStatement = (id: string, data: MedicationStatement) => {
  return axios.put(`${FHIR_URL}/MedicationStatement/${id}`, JSON.stringify(data), {

      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}