import axios from "axios";
import { auth } from "./auth";

export const getServiceTypes = () => {
    return axios.get(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/codesystem/service-types`, {auth})
}