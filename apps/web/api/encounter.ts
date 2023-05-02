import axios from "axios";
import { Encounter } from "fhir/r4";
import { APP_SERVER_URL, FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { CreateEncounterInput } from "../payload";

export const getEncounter = (id: string) => {
  return axios.get(`${FHIR_URL}/Encounter/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const createEncounter = (data: CreateEncounterInput) => {
    return axios.post(`${APP_SERVER_URL}/encounters`, JSON.stringify(data), {

        headers: {
          'Content-Type': 'application/json',
        }
      });
}

export const getAllEncounters = (page: PaginationInput, searchParams?: string) => {
    return axios.get(`${FHIR_URL}/Encounter?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {

        headers: {
          'Content-Type': 'application/json'
        }
      });
}

export const updateEncounter = (id: string, data: Encounter) => {
  return axios.put(`${FHIR_URL}/Encounter/${id}`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    }); 
}