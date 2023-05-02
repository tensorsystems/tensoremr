import axios from "axios";

export const getExtensions = () => {
  return axios.get(`${process.env.NX_PUBLIC_EXTENSION_URL}`);
}
