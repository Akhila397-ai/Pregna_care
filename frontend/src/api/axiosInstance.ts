import axios from "axios";
import { config } from "dotenv";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});


axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if(token) {
        config.headers.Authorization = ` Bearer ${token}`;
    }
    return config
});

export default axiosInstance;