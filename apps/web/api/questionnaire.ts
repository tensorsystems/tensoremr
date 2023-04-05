import axios from "axios";
import {  APP_SERVER_URL } from ".";
import { auth } from "./auth";

export const getReviewOfSystemsQuestionnaire = () => {
    return axios.get(`${APP_SERVER_URL}/questionnaire/local/Review-of-systems.R4.json`, {
        auth,
        headers: {
          'Content-Type': 'application/json'
        }
      });
}

export const getVitalSignsQuestionnaire = () => {
  return axios.get(`${APP_SERVER_URL}/questionnaire/Vital-signs-with-method-details-panel.R4.json`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


export const getPhysicalExamQuestionnaire = () => {
  return axios.get(`${APP_SERVER_URL}/questionnaire/Physical-Examination.R4.json`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getPastDisordersQuestionnaire = () => {
  return axios.get(`${APP_SERVER_URL}/questionnaire/Past-Disorder.R4.json`, {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}