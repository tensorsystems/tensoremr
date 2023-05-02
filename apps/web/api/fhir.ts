import axios from "axios";
import {  FHIR_URL } from ".";


export const getBatch = (body: any) => {
    return axios.post(`${FHIR_URL}`, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }