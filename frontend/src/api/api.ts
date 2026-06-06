import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN ATTACHED:", token); 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          import.meta.env.VITE_REFRESH_TOKEN,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (error) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);