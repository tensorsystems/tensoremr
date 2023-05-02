import axios from "axios";
import { QuestionnaireResponse } from "fhir/r4";
import {  FHIR_URL } from ".";
import { PaginationInput } from "../model";

export const createQuestionnaireResponse = (data: QuestionnaireResponse) => {
    return axios.post(`${FHIR_URL}/QuestionnaireResponse`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }); 
}


export const getQuestionnaireResponses = (page: PaginationInput, searchParams?: string) => {
  return axios.get(`${FHIR_URL}/QuestionnaireResponse?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getQuestionnaireResponseHistories = (id: string) => {
  return axios.get(`${FHIR_URL}/QuestionnaireResponse/${id}/_history`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getQuestionnaireResponse = (QuestionnaireResponseId: string) => {
  return axios.get(`${FHIR_URL}/QuestionnaireResponse/${QuestionnaireResponseId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getQuestionnaireResponseHistory = (QuestionnaireResponseId: string, versionId: string) => {
  return axios.get(`${FHIR_URL}/QuestionnaireResponse/${QuestionnaireResponseId}/_history/${versionId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const updateQuestionnaireResponse = (id: string, data: QuestionnaireResponse) => {
  return axios.put(`${FHIR_URL}/QuestionnaireResponse/${id}`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      }
    }); 
}