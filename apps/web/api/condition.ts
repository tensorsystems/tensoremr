import axios from "axios";
import { Condition } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createCondition = (data: Condition) => {
    return axios.post(`${FHIR_URL}/Condition`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}

export const getConditions = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/Condition?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}