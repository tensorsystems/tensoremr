import axios from "axios";
import { PaginationInput } from "../model";

export const getAllActivityDefinition = (page: PaginationInput, searchParams?: string) => {
    return axios.get(`${process.env.NX_PUBLIC_FHIR_URL}/ActivityDefinition?_count=${page.size}&_page=${page.page}&${searchParams ?? ''}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
}