import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.BASE_URL || "https://eat360-server.vercel.app",
});
