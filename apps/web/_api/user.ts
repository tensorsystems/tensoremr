import { CreateUserInput, UpdateUserInput } from "@tensoremr/models";
import axios from "axios";
import { auth } from "./auth";

export const createUser = (data: CreateUserInput) => {
  return axios.post(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/users`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const updateUser = (data: UpdateUserInput) => {
  return axios.put(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/users/${data.id}`, JSON.stringify(data), {
    auth,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getAllUsers = (searchTerm: string, baseUrl?: string) => {
  return axios.get(`${baseUrl ? baseUrl : process.env.NEXT_PUBLIC_APP_SERVER_URL}/users?search=${searchTerm}`, {auth})
}

export const getOneUser = (userId: string) => {
  return axios.get(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/users/${userId}`, {auth})
}
