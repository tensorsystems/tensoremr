
import axios from "axios";
import { CreateUserInput, UpdateUserInput } from "../payload";

export const createUser = (data: CreateUserInput) => {
  return axios.post(`${process.env.NX_PUBLIC_APP_SERVER_URL}/users`, JSON.stringify(data), {
    
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const updateUser = (data: UpdateUserInput) => {
  return axios.put(`${process.env.NX_PUBLIC_APP_SERVER_URL}/users/${data.id}`, JSON.stringify(data), {
    
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getAllUsers = (searchTerm: string) => {
  return axios.get(`${process.env.NX_PUBLIC_APP_SERVER_URL}/users?search=${searchTerm}`)
}

export const getCurrentUser = () => {
  return axios.get(`${process.env.NX_PUBLIC_APP_SERVER_URL}/currentUser`)
}

export const getOneUser = (userId: string) => {
  return axios.get(`${process.env.NX_PUBLIC_APP_SERVER_URL}/users/${userId}`)
}
