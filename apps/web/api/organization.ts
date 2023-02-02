import axios from "axios";
import { Organization } from "fhir/r4";
import { auth } from "./auth";

export const getCurrentOrganization = () => {
  return axios.get(`${process.env.NX_PUBLIC_APP_SERVER_URL}/currentOrganization`, {
    auth,
  });
}

export const getAllOrganizations = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Organization`, {
    auth,
  });
}

export const createOrganization = (data: Organization) => {
  return axios.post(`${process.env.NX_PUBLIC_FHIR_URL}/Organization`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateOrganization = (data: Organization) => {
  return axios.put(`${process.env.NX_PUBLIC_FHIR_URL}/Organization/${data.id}`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}