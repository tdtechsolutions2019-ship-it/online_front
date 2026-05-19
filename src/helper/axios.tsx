import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const BASE_URL = "http://localhost:5000/api";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const service = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Request Interceptor (Attach Token Automatically)
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // ❗ Skip token for login & forgot password APIs
    const skipAuthRoutes = ["auth/login", "auth/forgot-password"];

    const isAuthRoute = skipAuthRoutes.some((route) =>
      config.url.includes(route)
    );

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ❌ Common Error Handler
const handleError = (error) => {
  console.error("API Error:", error);

  if (error.message === "Network Error") {
    alert("Server is not responding. Please try again later.");
  }

  return error.response || { data: { message: "Unknown error occurred" } };
};


// ✅ CREATE (POST)
export const createData = async (path: string, payload: any) => {

  try {
    const response = await service.post(path, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};


// ✅ READ (GET)
export const readData = async (path: string, options: any = {}) => {
  try {
    const response = await service.get(path, { ...options });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};


// ✅ UPDATE (PUT)
export const updateData = async (path: string, data: any) => {
  try {
    const response = await service.put(path, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};


// ✅ DELETE
export const deleteData = async (path: string) => {
  try {
    const response = await service.delete(path);
    return response.data;


  } catch (error) {
    return handleError(error);
  }
};