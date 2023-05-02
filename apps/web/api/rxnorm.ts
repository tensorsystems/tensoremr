import axios from "axios";
import {  APP_SERVER_URL } from ".";

export const getRxApproximateTerms = (term: string) => {
    return axios.get(`${APP_SERVER_URL}/rxnorm/getApproximateTerms?term=${term}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}

export const getAllRelatedInfo = (rxcui: string) => {
    return axios.get(`${APP_SERVER_URL}/rxnorm/${rxcui}/getAllRelatedInfo`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}


