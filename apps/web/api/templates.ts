import axios from "axios";
import { APP_SERVER_URL } from ".";
import { auth } from "./auth";


export const getReviewOfSystemsTemplateDefault = () => {
    return axios.get(`${APP_SERVER_URL}/templates/review_of_systems_default.json`, {
        auth,
        headers: {
          'Content-Type': 'application/json'
        }
      });
}