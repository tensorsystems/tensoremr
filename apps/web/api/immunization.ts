import axios from "axios";
import { Immunization } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";

export const createImmunization = (data: Immunization) => {
    return axios.post(`${FHIR_URL}/Immunization`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}


export const getImmunizations = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/Immunization?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getImmunizationHistories = (id: string) => {
  return axios.get(`${FHIR_URL}/Immunization/${id}/_history`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getImmunization = (id: string) => {
  return axios.get(`${FHIR_URL}/Immunization/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getImmunizationistory = (immunizationId: string, versionId: string) => {
  return axios.get(`${FHIR_URL}/Immunization/${immunizationId}/_history/${versionId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateImmunization = (id: string, data: Immunization) => {
  return axios.put(`${FHIR_URL}/Immunization/${id}`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}