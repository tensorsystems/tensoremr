import axios from "axios";
import {  Schedule } from "fhir/r4";
import { PaginationInput } from "../model";
import { auth } from "./auth";

export const getAllSchedules = (page: PaginationInput) => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Schedule?_count=${page.size}&_page=${page.page}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const createSchedule = (data: Schedule) => {
  return axios.post(`${process.env.NX_PUBLIC_FHIR_URL}/Schedule`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const searchSchedules = (term: string) => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Schedule?${term}`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}