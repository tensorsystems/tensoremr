import axios from "axios";
import {  APP_SERVER_URL } from ".";

export const searchLoincForms = (term: string) => {
    return axios.get(`${APP_SERVER_URL}/loinc/searchForms?term=${term}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}

export const getLoincQuestionnaire = (loincId: string) => {
  return axios.get(`${APP_SERVER_URL}/questionnaire/loinc/${loincId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
}