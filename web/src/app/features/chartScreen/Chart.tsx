import { Spinner } from '@/components/ui/spinner';
import { useInstrumentChartStore } from '@/stores/instrumentChart/store';
import React from 'react'

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
            {ohlc.map((item) => (
                <div 
                    key={item.timestamp} 
                    className='flex justify-between items-center p-2 border-b border-gray-200 hover:bg-gray-50 transition'
                >
                    <span className='text-sm font-medium text-gray-700'>O: {item.open}</span>
                    <span className='text-sm font-medium text-gray-700'>H: {item.high}</span>
                    <span className='text-sm font-medium text-gray-700'>L: {item.low}</span>
                    <span className='text-sm font-medium text-gray-700'>C: {item.close}</span>
                    <span className='text-sm font-medium text-gray-700'>V: {item.volume}</span>
                    <span className='text-sm font-medium text-gray-500'>T: {new Date(item.timestamp).toLocaleString()}</span>
                </div>
            ))}
        </div>
  )
}

export default Chart