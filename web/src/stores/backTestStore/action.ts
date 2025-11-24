import { backTestStore, INITIAL_STATE } from "./store";

export const setTimeStampIndex = (index: number) => {
    backTestStore.setState({ timeStampIndex: index, resetChart: false });
}

export const backTestToggle = (isEnable: boolean) => {
    backTestStore.setState({ ...INITIAL_STATE, isBacktestEnable: isEnable });
}

export const setStartPlaying = () => {
    backTestStore.setState({ isPlaying: true });
}

export const setStopPlaying = () => {
    backTestStore.setState({ isPlaying: false, timeStampIndex: null });
}

export const setResetChart = () => {
    backTestStore.setState({ resetChart: true, isPlaying: false, timeStampIndex: null });
}
