import axios from "axios";

const BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE == "remote"
    ? import.meta.env.BASE_URL
    : "http://localhost:8080";

export const instance = axios.create({
  baseURL: BASE_URL,
});
