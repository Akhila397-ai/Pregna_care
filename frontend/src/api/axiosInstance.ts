import axios from "axios";
import { config } from "dotenv";
import { store } from "../store";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
    
});


axiosInstance.interceptors.request.use((config) => {
  const token = 
  // store.getState().auth.token ||
  sessionStorage.getItem('accessToken');

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response?.status === 401){
      sessionStorage.removeItem('accessToken')
    }
    return Promise.reject(error);
  }
)

export default axiosInstance;