import LOCAL_STORAGE_KEYS from '@/constants/localStorageKeys';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    headers:{
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        if(authToken){
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;