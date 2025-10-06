import axios from 'axios';
import { getAuthTokenFromLocalStorage } from './localStorageStates';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    headers:{
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = getAuthTokenFromLocalStorage();
        if(authToken){
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;