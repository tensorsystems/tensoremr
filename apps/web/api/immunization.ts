import axios from "axios";
import { Immunization } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createImmunization = (data: Immunization) => {
    return axios.post(`${FHIR_URL}/Immunization`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}


export const getImmunizations = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/Immunization?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getImmunizationHistories = (id: string) => {
  return axios.get(`${FHIR_URL}/Immunization/${id}/_history`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getImmunization = (id: string) => {
  return axios.get(`${FHIR_URL}/Immunization/${id}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getImmunizationistory = (immunizationId: string, versionId: string) => {
  return axios.get(`${FHIR_URL}/Immunization/${immunizationId}/_history/${versionId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateImmunization = (id: string, data: Immunization) => {
  return axios.put(`${FHIR_URL}/Immunization/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}