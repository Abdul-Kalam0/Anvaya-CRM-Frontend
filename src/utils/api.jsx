import axios from "axios";

const api = axios.create({
  baseURL: "https://anvaya-crm-backend-001.vercel.app",
  timeout: 5000, // Add timeout to avoid hanging
});

// Optional: Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
