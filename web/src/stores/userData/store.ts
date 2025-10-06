import { create } from "zustand";
import { createSelectors } from "@/lib/zustandCreateSelectors";
import { UserDataStore } from "@/types/UserDataType";

export const INITIAL_STATE: UserDataStore = {
    userId: null,
    name: null,
    email: null,
};

export const userDataStore = create<UserDataStore>(() => (INITIAL_STATE));

export const useUserDataStore = createSelectors(userDataStore);