import React from 'react'
import InstrumentSelection from "../../../components/instrumentSelection/InstrumentSelection";
import { useInstrumentChartStore } from '@/stores/instrumentChart/store';

const ChartScreen = () => {
    const instrumentName = useInstrumentChartStore.use.instrumentName();
    const instrumentExchange = useInstrumentChartStore.use.exchange();
    const tradingSymbol = useInstrumentChartStore.use.tradingSymbol();
    const ohlc = useInstrumentChartStore.use.ohlc();
    const fromDate = useInstrumentChartStore.use.fromDate();
    const toDate = useInstrumentChartStore.use.toDate();

  return (
    <>
    <InstrumentSelection/>
    <div className='flex flex-col gap-6'>
        <span>{instrumentName}</span>
        <span>{tradingSymbol}</span>
        <span>{instrumentExchange}</span>
        <span>{fromDate}</span>
        <span>{toDate}</span>
        <span>Today</span>
        <div className='flex flex-col gap-4'>
            {ohlc.map((item) => {
                return (
                    <div key={item.timestamp} className='flex gap-2'>
                        <span> O: {item.open}</span>
                        <span> H: {item.high}</span>
                        <span> L: {item.low}</span>
                        <span> C: {item.close}</span>
                    </div>
                )
            })}
        </div>
    </div>
    </>
  )
}

export default ChartScreen