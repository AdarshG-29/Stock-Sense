import { Spinner } from '@/components/ui/spinner';
import { useInstrumentChartStore } from '@/stores/instrumentChart/store';
import TradingViewChart from '../tradingViewChart/TradingViewChart';
import { useBackTestStore } from '@/stores/backTestStore/store';
import { setResetChart, setStartPlaying, setStopPlaying } from '@/stores/backTestStore/action';
import { PlayIcon, StopCircleIcon, RefreshCwIcon } from 'lucide-react';

const Chart = () => {
    const isBacktestEnable = useBackTestStore.use.isBacktestEnable();
    const ohlc = useInstrumentChartStore.use.ohlc();
    const isLoading = useInstrumentChartStore.use.isLoading();
    const isError = useInstrumentChartStore.use.isError();

    if (isLoading) {
        return (
            <div className="w-100 flex justify-center items-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-red-500 font-bold">
                Error loading chart data. Please try again.
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-4">
            {ohlc.length > 0 && isBacktestEnable && (
                <div className="w-full flex items-center justify-center gap-4 ml-auto">
                    <PlayIcon
                        className="w-8 h-8 text-green-500 font-bold cursor-pointer border border-gray-300 bg-black p-2 rounded"
                        onClick={setStartPlaying}
                        xlinkTitle="Start"
                    />
                    <StopCircleIcon
                        className="w-8 h-8 text-red-500 font-bold cursor-pointer border border-gray-300 bg-black p-2 rounded"
                        onClick={setStopPlaying}
                        xlinkTitle="Stop"
                    />
                    <RefreshCwIcon
                        className="w-8 h-8 text-blue-500 font-bold cursor-pointer border border-gray-300 bg-black p-2 rounded"
                        onClick={setResetChart}
                        xlinkTitle="Reset"
                    />
                </div>
            )}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <TradingViewChart />
            </div>
        </div>
    );
};

export default Chart;
