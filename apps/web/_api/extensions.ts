import axios from "axios";
import { auth } from "./auth";

export const getExtensions = () => {
  return axios.get(`${process.env.NEXT_PUBLIC_EXTENSION_URL}`, {
    auth,
  });
}
