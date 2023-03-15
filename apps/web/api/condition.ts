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
          'Prefer': 'return=representation'
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

export const getConditionsBatch = (body: any) => {
  return axios.post(`${FHIR_URL}`, JSON.stringify(body), {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getConditionHistories = (id: string) => {
  return axios.get(`${FHIR_URL}/Condition/${id}/_history`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getCondition = (conditionId: string) => {
  return axios.get(`${FHIR_URL}/Condition/${conditionId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getConditionHistory = (conditionId: string, versionId: string) => {
  return axios.get(`${FHIR_URL}/Condition/${conditionId}/_history/${versionId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateCondition = (id: string, data: Condition) => {
  return axios.put(`${FHIR_URL}/Condition/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}