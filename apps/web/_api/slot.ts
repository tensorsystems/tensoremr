import axios from "axios";
import {  Bundle, Slot } from "fhir/r4";
import { auth } from "./auth";

export const createSlot = (data: Slot) => {
  return axios.post(`${process.env.NEXT_PUBLIC_FHIR_URL}/Slot`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
}

export const createSlotBatch = (data: Bundle) => {
  return axios.post(`${process.env.NEXT_PUBLIC_FHIR_URL}`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
}

export const getSlotsBySchedule = (scheduleId: string) => {
  return axios.get(`${process.env.NEXT_PUBLIC_FHIR_URL}/Slot?schedule=${scheduleId}&_count=2000`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const searchSlots= (term: string, baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_FHIR_URL}/Slot?${term}&_count=2000`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}