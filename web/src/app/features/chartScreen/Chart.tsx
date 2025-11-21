import { Spinner } from '@/components/ui/spinner';
import { useInstrumentChartStore } from '@/stores/instrumentChart/store';
import React from 'react'
import TradingViewChart from '../tradingViewChart/TradingViewChart';
import { formatOhlcDataIntoChartData, formatVolumeDataIntoChartData } from '@/utils/helper';

const Chart = () => {
    const ohlc = useInstrumentChartStore.use.ohlc();
    const isLoading = useInstrumentChartStore.use.isLoading();
    const isError = useInstrumentChartStore.use.isError();

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
    <div className='flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md'>
            <TradingViewChart 
            candleData={formatOhlcDataIntoChartData(ohlc)}
            volumeData={formatVolumeDataIntoChartData(ohlc)}/>
        </div>
  )
}

export default Chart