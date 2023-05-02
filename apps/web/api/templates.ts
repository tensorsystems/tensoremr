import axios from "axios";
import { APP_SERVER_URL } from ".";


export const getReviewOfSystemsTemplateDefault = () => {
    return axios.get(`${APP_SERVER_URL}/templates/review_of_systems_default.json`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}