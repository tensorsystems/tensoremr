import axios from "axios";
import {  APP_SERVER_URL } from ".";
import { auth } from "./auth";

export const getApproximateTerms = (term: string) => {
    return axios.get(`${APP_SERVER_URL}/rxnorm/getApproximateTerms?term=${term}`, {
        auth,
        headers: {
          'Content-Type': 'application/json'
        }
      });
}

export const getAllRelatedInfo = (rxcui: string) => {
    return axios.get(`${APP_SERVER_URL}/rxnorm/${rxcui}/getAllRelatedInfo`, {
        auth,
        headers: {
          'Content-Type': 'application/json'
        }
      });
}


