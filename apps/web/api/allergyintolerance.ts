import axios from "axios";
import { AllergyIntolerance } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createAllergyIntolerance = (data: AllergyIntolerance) => {
    return axios.post(`${FHIR_URL}/AllergyIntolerance`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}


export const getAllergyIntolerances = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/AllergyIntolerance?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getAllergyIntoleranceHistories = (id: string) => {
  return axios.get(`${FHIR_URL}/AllergyIntolerance/${id}/_history`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getAllergyIntolerance = (id: string) => {
  return axios.get(`${FHIR_URL}/AllergyIntolerance/${id}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getAllergyIntoleranceistory = (AllergyIntoleranceId: string, versionId: string) => {
  return axios.get(`${FHIR_URL}/AllergyIntolerance/${AllergyIntoleranceId}/_history/${versionId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateAllergyIntolerance = (id: string, data: AllergyIntolerance) => {
  return axios.put(`${FHIR_URL}/AllergyIntolerance/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}