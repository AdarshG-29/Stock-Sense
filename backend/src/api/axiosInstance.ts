import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'https://api.upstox.com/v3';

 const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export default axiosInstance;