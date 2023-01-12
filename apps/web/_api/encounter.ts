import axios from "axios";
import { Encounter } from "fhir/r4";
import { PaginationInput } from "../_model";
import { auth } from "./auth";

export const createEncounter = (data: Encounter) => {
    return axios.post(`${process.env.NX_PUBLIC_FHIR_URL}/Encounter`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      });
}

export const getAllEncounters = (page: PaginationInput, searchParams?: string) => {
    return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Encounter?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
        auth,
        headers: {
          'Content-Type': 'application/json'
        }
      });
}