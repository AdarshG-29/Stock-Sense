import axiosInstance from "@/lib/axiosInstance";

export const registerUser = (userData: { name: string; email: string; password: string }) => {
    const url = '/auth/register';
    return axiosInstance.post(url, userData)
}

export const loginUser = (credentials: { email: string; password: string }) => {
    const url = '/auth/login';
    return axiosInstance.post(url, credentials)     
}

export const logoutUser = () => {
    const url = '/auth/logout';
    return axiosInstance.post(url)
}

export const getUser = () => {
    const url = '/auth/user';
    return axiosInstance.get(url)
}