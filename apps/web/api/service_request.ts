import axios from "axios";
import { ServiceRequest } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createServiceRequest = (data: ServiceRequest) => {
    return axios.post(`${FHIR_URL}/ServiceRequest`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }); 
}


export const getServiceRequests = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/ServiceRequest?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getServiceRequestHistories = (id: string) => {
  return axios.get(`${FHIR_URL}/ServiceRequest/${id}/_history`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getServiceRequest = (ServiceRequestId: string) => {
  return axios.get(`${FHIR_URL}/ServiceRequest/${ServiceRequestId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getServiceRequestHistory = (ServiceRequestId: string, versionId: string) => {
  return axios.get(`${FHIR_URL}/ServiceRequest/${ServiceRequestId}/_history/${versionId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateServiceRequest = (id: string, data: ServiceRequest) => {
  return axios.put(`${FHIR_URL}/ServiceRequest/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}