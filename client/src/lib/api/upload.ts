import axios from "axios";

import { instance } from "../config";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post(
    `${instance.defaults.baseURL}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data.url;
}
