import { Spinner } from '@/components/ui/spinner';
import { useInstrumentChartStore } from '@/stores/instrumentChart/store';
import { useState } from 'react'
import TradingViewChart from '../tradingViewChart/TradingViewChart';
import { getLocalTimeStamp } from '@/utils/helper';
import Dropdown from '@/components/dropdown/Dropdown';
import { UTCTimestamp } from 'lightweight-charts';
import { Button } from '@/components/ui/button';
import { useBackTestStore } from '@/stores/backTestStore/store';
import { setResetChart, setStartPlaying, setStopPlaying, setTimeStampIndex } from '@/stores/backTestStore/action';

const Chart = () => {
    const [timeStampInterval, setTimeStampInterval] = useState<UTCTimestamp | null>();

    const isBacktestEnable = useBackTestStore.use.isBacktestEnable();
    const timeStampIndex = useBackTestStore.use.timeStampIndex();
    const isPlaying = useBackTestStore.use.isPlaying();
    const resetChart = useBackTestStore.use.resetChart();

    const ohlc = useInstrumentChartStore.use.ohlc();
    const isLoading = useInstrumentChartStore.use.isLoading();
    const isError = useInstrumentChartStore.use.isError();


const onTimeStampIntervalChange = (timeStamp: string) => {
    if(timeStamp.length===0) {
        return;
    }
    const timeStampInterval = parseInt(timeStamp) as UTCTimestamp;
    const currentIndex = ohlc.findIndex((item) => item.timeStamp === timeStampInterval);
    setTimeStampInterval(timeStampInterval);
    setTimeStampIndex(currentIndex);
}

const onStopReplay = () => {
   setTimeStampInterval(null);
   setStopPlaying();
}

const onResetChartClick = () => {
    setTimeStampInterval(null);
    setResetChart();
}

    if (isLoading) {
        return (
            <div className='w-100 flex justify-center items-center'>
               <Spinner className='size-8'/>
            </div>
        );
    }

    if(isError) {
        return (
            <div className='text-red-500 font-bold'>
                Error loading chart data. Please try again.
            </div>
        );
    }

  return (
    <div className='flex flex-col gap-4'>
        {
        ohlc.length > 0 && isBacktestEnable &&
        <div className='flex gap-4 items-end'>
        <Dropdown
            value={timeStampInterval ? timeStampInterval.toString(): ''}
            options={ohlc ? ohlc.map((item) => ({
                label: getLocalTimeStamp(item.timeStamp),
                value: item.timeStamp.toString()
            })) : []}
            onValueChange={onTimeStampIntervalChange}
            label="Timestamp Interval"
        />
        <Button variant="default" 
        onClick={setStartPlaying} 
        disabled={timeStampIndex===null}>
            Start replay
            </Button>
        <Button variant="default" 
        onClick={onStopReplay}
        disabled={!isPlaying}>
            Stop replay</Button>
        <Button variant="default" 
        onClick={onResetChartClick}
        >Reset chart</Button>
        </div>
        }
        <div className='bg-white p-4 rounded-lg shadow-md'>
            <TradingViewChart
            ohlcData={ohlc}
            timeStampIndex={timeStampIndex}
            isPlaying={isPlaying}
            resetChart={resetChart}
            stopReplay={onStopReplay}
            isBacktestEnable={isBacktestEnable}
            />
            </div>
        </div>
  )
}

export default Chart