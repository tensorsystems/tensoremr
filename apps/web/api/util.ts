
import axios from "axios";
import { APP_SERVER_URL } from ".";

export const getServerTime = () => {
    return axios.get(`${APP_SERVER_URL}/time`)
}