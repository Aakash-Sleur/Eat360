import { BASE_URL } from "./../constants/index";
import axios from "axios";

export const instance = axios.create({
  baseURL: BASE_URL,
});
