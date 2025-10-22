import { instance } from "@/lib/config";
import { INewUser } from "@/lib/types";
import axios from "axios";

async function createUser({ username, name, email, password }: INewUser) {
  try {
    const response = await instance.post(`/auth/register`, {
      username,
      name,
      email,
      password,
    });

    if (response.status !== 200) {
      throw new Error("Error creating user");
    }

    return response.data;
  } catch (error) {
    console.error(`[ERROR_CREATE_USER]-${error}`);
  }
}

async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const AUTH_URL = import.meta.env.VITE_BASE_AUTH_URL || "";
    const response = await axios.post(`${AUTH_URL}/auth/login`, {
      email,
      password,
    });

    localStorage.setItem("eat360-accessToken", response.data.token);
    console.log(localStorage.getItem("eat360-accessToken"))

    if (response.status !== 200) {
      throw new Error("Error creating user");
    }

    return response.data;
  } catch (error) {
    console.error(`[ERROR_CREATE_USER]-${error}`);
  }
}

export { createUser, loginUser };
