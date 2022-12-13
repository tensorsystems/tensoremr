import axios from "axios";
import {  Slot } from "fhir/r4";
import { auth } from "./auth";

export const createSlot = (data: Slot) => {
  return axios.post(`${process.env.NEXT_PUBLIC_FHIR_URL}/Slot`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}