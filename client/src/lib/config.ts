import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("eat360-accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔐 Logout function injected from context
let logoutFunction: ((message?: string) => void) | null = null;

export const setLogoutFunction = (fn: (message?: string) => void) => {
  logoutFunction = fn;
};

let isLoggingOut = false; // Prevent multiple redirects

instance.interceptors.response.use(
  (response) => {
    // ✅ Check if backend sends a token-expired message inside a 200 response
    const msg = response.data?.message?.toLowerCase?.() || "";
    if (msg.includes("token expired") || msg.includes("invalid token")) {
      if (!isLoggingOut) {
        isLoggingOut = true;
        localStorage.removeItem("eat360-accessToken");
        if (logoutFunction) logoutFunction("Session expired. Please log in again.");
      }
    }
    return response;
  },
  (error) => {
    // ✅ Handle 401 Unauthorized or explicit "token expired" errors
    const msg = error.response?.data?.message?.toLowerCase?.() || "";

    if (
      error.response?.status === 401 ||
      msg.includes("token expired") ||
      msg.includes("invalid token")
    ) {
      if (!isLoggingOut) {
        isLoggingOut = true;
        localStorage.removeItem("eat360-accessToken");
        if (logoutFunction) logoutFunction("Session expired. Please log in again.");
      }
    }

    return Promise.reject(error);
  }
);

export { instance };
