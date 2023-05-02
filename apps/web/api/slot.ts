import axios from "axios";
import {  Bundle, Slot } from "fhir/r4";

export const createSlot = (data: Slot) => {
  return axios.post(`${process.env.NX_PUBLIC_FHIR_URL}/Slot`, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
}

export const createSlotBatch = (data: Bundle) => {
  return axios.post(`${process.env.NX_PUBLIC_FHIR_URL}`, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
}

export const getSlotsBySchedule = (scheduleId: string) => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Slot?schedule=${scheduleId}&_count=2000`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const searchSlots= (term: string) => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Slot?${term}&_count=2000`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}