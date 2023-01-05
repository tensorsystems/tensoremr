import axios from "axios";
import { auth } from "./auth";

export const getExtensions = () => {
  return axios.get(`${process.env.NX_PUBLIC_EXTENSION_URL}`, {
    auth,
  });
}
