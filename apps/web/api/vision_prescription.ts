import axios from "axios";
import { VisionPrescription } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const createVisionPrescription = (data: VisionPrescription) => {
    return axios.post(`${FHIR_URL}/VisionPrescription`, JSON.stringify(data), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}

export const getVisionPrescriptions = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/VisionPrescription?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getVisionPrescription = (VisionPrescriptionId: string) => {
  return axios.get(`${FHIR_URL}/VisionPrescription/${VisionPrescriptionId}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateVisionPrescription = (id: string, data: VisionPrescription) => {
  return axios.put(`${FHIR_URL}/VisionPrescription/${id}`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}