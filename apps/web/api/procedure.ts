import axios from "axios";
import { Procedure } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createProcedure = (data: Procedure) => {
    return axios.post(`${FHIR_URL}/Procedure`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}

export const getProcedures = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/Procedure?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getProcedure = (procedureId: string) => {
  return axios.get(`${FHIR_URL}/Procedure/${procedureId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


export const updateProcedure = (id: string, data: Procedure) => {
  return axios.put(`${FHIR_URL}/Procedure/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}