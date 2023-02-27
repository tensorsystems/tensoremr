import axios from "axios";
import { CareTeam } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const getCareTeam = (id: string) => {
    return axios.get(`${FHIR_URL}/CareTeam/${id}`, {
      auth,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  export const createCareTeam = (data: CareTeam) => {
      return axios.post(`${FHIR_URL}/CareTeam`, JSON.stringify(data), {
          auth,
          headers: {
            'Content-Type': 'application/json',
          }
        });
  }
  
  export const getAllCareTeams = (page: PaginationInput, searchParams?: string) => {
      return axios.get(`${FHIR_URL}/CareTeam?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
          auth,
          headers: {
            'Content-Type': 'application/json'
          }
        });
  }
  
  export const updateCareTeam = (id: string, data: CareTeam) => {
    return axios.put(`${FHIR_URL}/CareTeam/${id}`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }); 
  }