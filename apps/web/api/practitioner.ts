import axios from "axios";
import { auth } from "./auth";

export const getPracititioner = (id: string) => {
    return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Practitioner/${id}`, {
      auth,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }