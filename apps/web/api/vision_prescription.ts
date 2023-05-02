import axios from "axios";
import { VisionPrescription } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";

export const createVisionPrescription = (data: VisionPrescription) => {
    return axios.post(`${FHIR_URL}/VisionPrescription`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        }
      }); 
}

export const getVisionPrescriptions = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/VisionPrescription?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getVisionPrescription = (VisionPrescriptionId: string) => {
  return axios.get(`${FHIR_URL}/VisionPrescription/${VisionPrescriptionId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateVisionPrescription = (id: string, data: VisionPrescription) => {
  return axios.put(`${FHIR_URL}/VisionPrescription/${id}`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}