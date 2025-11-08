/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearAllLocalStorage, getUserInfoFromLocalStorage, hasAuthTokenInLocalStorage, setAuthTokenToLocalStorage, setUserInfoToLocalStorage } from "@/lib/localStorageStates";
import { toast } from "sonner";
import { getUser, loginUser, logoutUser, registerUser } from "./apis";
import { clearUserData, setUserData } from "@/stores/userData/action";


export const onSignup = async (name: string, email: string, password: string) => {
    try{
        const res = await registerUser({name, email, password}) 
        const {message, token} = res.data ?? {};
        if(token){
            setAuthTokenToLocalStorage(token);
        }
        getUserData()
        toast.success(message || 'Signup successful');
    }
    catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.error);
    }
}

export const onLogin = async (email: string, password: string) => {
    try {
        const res = await loginUser({email, password}) 
        const {message, token} = res.data ?? {};
        if(token){
            setAuthTokenToLocalStorage(token);
        }
        getUserData()
        toast.success(message || 'Login successful');
    }
    catch (error: any) {
        toast.error(error?.response?.data?.error || 'Error logging in. Please try again.');
    }
}

export const onLogout = async () => {
    try {
        const res = await logoutUser();
        toast.success(res.data?.message || 'Logout successful');
        clearUserData();
        clearAllLocalStorage();
    } catch(error: any) {
        toast.error(error?.response?.data?.error || 'Error logging out. Please try again.');
    }
}

export const getUserData = async () => {
    const userData = getUserInfoFromLocalStorage();

    if(hasAuthTokenInLocalStorage() && userData) {
        setUserData(userData);
        return;
    }
    try {
        const res = await getUser();
       const userData = res.data?.user;
      setUserInfoToLocalStorage(userData);
      setUserData(userData);
    } catch(error: any) {
        console.error(error?.response?.data?.error);
    }
}