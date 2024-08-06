import axios from "axios";

import { instance } from "@/lib/config";
import { INewUser } from "@/lib/types";

async function createUser({ username, name, email, password }: INewUser) {
  try {
    const response = await axios.post(
      `${instance.defaults.baseURL}/auth/register`,
      {
        username,
        name,
        email,
        password,
      }
    );

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
    const response = await axios.post(
      `${instance.defaults.baseURL}/auth/login`,
      {
        email,
        password,
      }
    );

    if (response.status !== 200) {
      throw new Error("Error creating user");
    }

    return response.data;
  } catch (error) {
    console.error(`[ERROR_CREATE_USER]-${error}`);
  }
}

export { createUser, loginUser };
