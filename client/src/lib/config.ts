import axios from "axios";

export const instance = axios.create({
  baseURL: "https://eat360-server.vercel.app",
});
