import { CreateUserInput } from "@tensoremr/models";
import axios from "axios";
import { auth } from "./auth";

export const createUser = (data: CreateUserInput) => {
  return axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/users`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getAllUsers = (searchTerm: string) => {
  return axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/users?search=${searchTerm}`, {auth})
}

export const getUser = (userId: string) => {
  return axios.get(`${import.meta.env.VITE_APP_SERVER_URL}/users/${userId}`, {auth})
}