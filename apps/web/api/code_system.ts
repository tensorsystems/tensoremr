import axios from "axios";

export const getServiceTypes = () => {
    return axios.get(`${process.env.NX_PUBLIC_APP_SERVER_URL}/codesystem/service-types`)
}