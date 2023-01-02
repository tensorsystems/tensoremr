import axios from "axios";
import {  Schedule } from "fhir/r4";
import { PaginationInput } from "../_model";
import { auth } from "./auth";

export const getAllSchedules = (page: PaginationInput) => {
  return axios.get(`${process.env.NEXT_PUBLIC_FHIR_URL}/Schedule?_count=${page.size}&_page=${page.page}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const createSchedule = (data: Schedule) => {
  return axios.post(`${process.env.NEXT_PUBLIC_FHIR_URL}/Schedule`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const searchSchedules = (term: string, baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_FHIR_URL}/Schedule?${term}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}