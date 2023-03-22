import axios from "axios";
import {  FHIR_URL } from ".";
import { auth } from "./auth";


export const getBatch = (body: any) => {
    return axios.post(`${FHIR_URL}`, JSON.stringify(body), {
      auth,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }