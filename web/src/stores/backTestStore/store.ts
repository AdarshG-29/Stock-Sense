import { createSelectors } from "@/lib/zustandCreateSelectors";
import { BackTestStoreType } from "@/types/backTest";
import { create } from "zustand";

export const INITIAL_STATE: BackTestStoreType = {
    isBacktestEnable: false,
    timeStampIndex: null,
    isPlaying: false,
    resetChart: false,
}

export const backTestStore = create<BackTestStoreType>(() => (INITIAL_STATE));

export const useBackTestStore = createSelectors(backTestStore);