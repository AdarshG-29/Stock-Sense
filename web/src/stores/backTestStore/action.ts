import { backTestStore, INITIAL_STATE } from "./store";

export const setTimeStampIndex = (index: number): void => {
    backTestStore.setState({ timeStampIndex: index, resetChart: false });
};

export const backTestToggle = (isEnable: boolean): void => {
    backTestStore.setState({ ...INITIAL_STATE, isBacktestEnable: isEnable });
};

export const setStartPlaying = (): void => {
    const { timeStampIndex, isPlaying } = backTestStore.getState();
    if (timeStampIndex === null || isPlaying) return;

    backTestStore.setState({ isPlaying: true });
};

export const setStopPlaying = (): void => {
    const { isPlaying } = backTestStore.getState();
    if (!isPlaying) return;

    backTestStore.setState({ isPlaying: false, timeStampIndex: null });
};

export const setResetChart = (): void => {
    backTestStore.setState({
        resetChart: true,
        isPlaying: false,
        timeStampIndex: null,
    });
};