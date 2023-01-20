import axios from "axios";
import { Task } from "fhir/r4";
import { APP_SERVER_URL, FHIR_URL } from ".";
import { PaginationInput } from "../_model";
import { auth } from "./auth";

export const createTask = (payload: Task) => {
    return axios.post(`${APP_SERVER_URL}/Task`, JSON.stringify(payload), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      });
}

export const getAllTasks = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/Task?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
      auth,
      headers: {
        'Content-Type': 'application/json'
      }
    });
}