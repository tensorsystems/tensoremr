import axios from "axios";
import { APP_SERVER_URL, FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { CreateEncounterInput } from "../payload";
import { auth } from "./auth";

export const getEncounter = (id: string) => {
  return axios.get(`${FHIR_URL}/Encounter/${id}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
export const createEncounter = (data: CreateEncounterInput) => {
    return axios.post(`${APP_SERVER_URL}/encounters`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      });
}

export const getAllEncounters = (page: PaginationInput, searchParams?: string) => {
    return axios.get(`${FHIR_URL}/Encounter?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
        auth,
        headers: {
          'Content-Type': 'application/json'
        }
      });
}