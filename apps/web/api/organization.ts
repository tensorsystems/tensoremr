import axios from "axios";
import { Organization } from "fhir/r4";

export const getCurrentOrganization = () => {
  return axios.get(`${process.env.NX_PUBLIC_APP_SERVER_URL}/currentOrganization`);
}

export const getAllOrganizations = () => {
  return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/Organization`);
}

export const createOrganization = (data: Organization) => {
  return axios.post(`${process.env.NX_PUBLIC_FHIR_URL}/Organization`, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateOrganization = (data: Organization) => {
  return axios.put(`${process.env.NX_PUBLIC_FHIR_URL}/Organization/${data.id}`, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}