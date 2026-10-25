import axios from "axios";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    // "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRedirecting = false;

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    const isAuthError =
      status === 401 ||
      (status === 403 &&
        (message === "Invalid or expired token" ||
         message === "User account is deactivated" ||
         (typeof message === "string" && message.toLowerCase().includes("token"))));

    if (isAuthError) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("userToken");
      localStorage.removeItem("admin");
      localStorage.removeItem("user");

      const publicPaths = ["/login", "/users/register", "/admin/register", "/forgot-password"];
      const currentPath = window.location.pathname;

      if (!publicPaths.includes(currentPath) && !isRedirecting) {
        isRedirecting = true;
        sessionStorage.setItem("sessionExpired", "true");
        if (currentPath.startsWith("/admin") || currentPath.startsWith("/super-admin")) {
          sessionStorage.setItem("sessionExpiredType", "Admin");
        }
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;