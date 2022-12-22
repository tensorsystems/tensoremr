import axios from "axios";
import { auth } from "./auth";

export const getServiceTypes = (baseUrl?: string) => {
    return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_APP_SERVER_URL}/codesystem/service-types`, {auth})
}