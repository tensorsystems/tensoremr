import axios from "axios";
import { APP_SERVER_URL } from ".";
import { PaginationInput } from "../model";

export const getConceptDescendants = (conceptId: string, page: PaginationInput) => {
    return axios.get(`${APP_SERVER_URL}/snomed/MAIN/concepts/${conceptId}/descendants?offset=${page.page}&limit=${page.size}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}

export const getConceptChildren = (conceptId: string) => {
    return axios.get(`${APP_SERVER_URL}/snomed/browser/MAIN/concepts/${conceptId}/children?form=inferred&includeDescendantCount=true`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}

export const searchConceptChildren = (body: any) => {
    return axios.post(`${APP_SERVER_URL}/snomed/MAIN/concepts/search`, JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}