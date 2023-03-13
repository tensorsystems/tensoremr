import axios from "axios";

export const fetch = (url: string) => {
  return axios.get(url, {

      headers: {
        'Content-Type': 'application/json'
      }
    });
}