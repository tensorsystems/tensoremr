import axios from "axios";
import { Organization } from "fhir/r4";
import { auth } from "./auth";

export const getAllOrganizations = () => {
  return axios.get(`${import.meta.env.VITE_FHIR_URL}/Organization`, {
    auth,
  });
}

export const createOrganization = (data: Organization) => {
  return axios.post(`${import.meta.env.VITE_FHIR_URL}/Organization`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateOrganization = ({id, data}: {id: string, data: Organization}) => {
  return axios.put(`${import.meta.env.VITE_FHIR_URL}/Organization/${id}`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}