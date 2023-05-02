import axios from "axios";
import {  Schedule } from "fhir/r4";
import { PaginationInput } from "../model";

export const getAllSchedules = (page: PaginationInput) => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Schedule?_count=${page.size}&_page=${page.page}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const createSchedule = (data: Schedule) => {
  return axios.post(`${process.env.NX_PUBLIC_FHIR_URL}/Schedule`, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const searchSchedules = (term: string) => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Schedule?${term}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}