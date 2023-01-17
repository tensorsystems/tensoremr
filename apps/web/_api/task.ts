import axios from "axios";
import { Task } from "fhir/r4";
import { auth } from "./auth";

export const createTask = (payload: Task) => {
    return axios.post(`${process.env.NX_PUBLIC_APP_SERVER_URL}/Task`, JSON.stringify(payload), {
        auth,
        headers: {
          'Content-Type': 'application/json',
        }
      });
}
