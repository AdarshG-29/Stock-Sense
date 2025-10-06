import { UserDataStore } from "@/types/UserDataType";
import { INITIAL_STATE, userDataStore } from "./store";

export const setUserData = (userData: UserDataStore) => {
    userDataStore.setState(userData);
}

export const clearUserData = () => {
    userDataStore.setState(INITIAL_STATE);
}

