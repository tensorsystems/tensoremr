import axios from "axios";
import { Location } from "fhir/r4";
import { PaginationInput } from "../_model";
import { auth } from "./auth";

export const createLocation = (data: Location) => {
    return axios.post(`${process.env.NX_PUBLIC_FHIR_URL}/Location`, JSON.stringify(data), {
      auth,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  export const getAllLocations = (page: PaginationInput) => {
    return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Location?_count=${page.size}&_page=${page.page}`, {
      auth,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }