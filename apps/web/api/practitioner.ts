import axios from "axios";

export const getPracititioner = (id: string) => {
    return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Practitioner/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }