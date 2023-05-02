import axios from "axios";
import { Condition } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";

export const createCondition = (data: Condition) => {
    return axios.post(`${FHIR_URL}/Condition`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }); 
}


export const getConditions = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/Condition?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getConditionHistories = (id: string) => {
  return axios.get(`${FHIR_URL}/Condition/${id}/_history`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getCondition = (conditionId: string) => {
  return axios.get(`${FHIR_URL}/Condition/${conditionId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getConditionHistory = (conditionId: string, versionId: string) => {
  return axios.get(`${FHIR_URL}/Condition/${conditionId}/_history/${versionId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateCondition = (id: string, data: Condition) => {
  return axios.put(`${FHIR_URL}/Condition/${id}`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}