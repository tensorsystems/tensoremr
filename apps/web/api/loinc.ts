import axios from "axios";
import {  APP_SERVER_URL } from ".";
import { auth } from "./auth";

export const searchLoincForms = (term: string) => {
    return axios.get(`${APP_SERVER_URL}/loinc/searchForms?term=${term}`, {
        auth,
        headers: {
          'Content-Type': 'application/json'
        }
      });
}

export const getLoincQuestionnaire = (loincId: string) => {
  return axios.get(`${APP_SERVER_URL}/loinc/questionnaire?loincId=${loincId}`, {
      auth,
      headers: {
        'Content-Type': 'application/json'
      }
    });
}