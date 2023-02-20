import axios from "axios";
import { Observation } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createObservation = (data: Observation) => {
    return axios.post(`${FHIR_URL}/Observation`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }); 
}


export const getObservations = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/Observation?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getObservationHistories = (id: string) => {
  return axios.get(`${FHIR_URL}/Observation/${id}/_history`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getObservation = (observationId: string) => {
  return axios.get(`${FHIR_URL}/Observation/${observationId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getObservationHistory = (observationId: string, versionId: string) => {
  return axios.get(`${FHIR_URL}/Observation/${observationId}/_history/${versionId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateObservation = (id: string, data: Observation) => {
  return axios.put(`${FHIR_URL}/Observation/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}