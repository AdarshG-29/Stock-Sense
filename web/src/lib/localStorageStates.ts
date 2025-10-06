import LOCAL_STORAGE_KEYS from "@/constants/localStorageKeys"
import { UserDataStore } from "@/types/UserDataType";

export const getAuthTokenFromLocalStorage = () => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
}

export const setAuthTokenToLocalStorage = (token: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
}

export const hasAuthTokenInLocalStorage = () => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN) !== null;
}
export const clearAllLocalStorage = () => {
    localStorage.clear();
}

export const getUserInfoFromLocalStorage = (): UserDataStore | null => {
    const userInfo = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    return userInfo ? JSON.parse(userInfo) as UserDataStore : null;
}

export const setUserInfoToLocalStorage = (userInfo: UserDataStore) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
}