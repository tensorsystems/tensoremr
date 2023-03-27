import axios from "axios";
import { DeviceRequest } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createDeviceRequest = (data: DeviceRequest) => {
    return axios.post(`${FHIR_URL}/DeviceRequest`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}

export const getDeviceRequests = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/DeviceRequest?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getDeviceRequest = (DeviceRequestId: string) => {
  return axios.get(`${FHIR_URL}/DeviceRequest/${DeviceRequestId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateDeviceRequest = (id: string, data: DeviceRequest) => {
  return axios.put(`${FHIR_URL}/DeviceRequest/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}