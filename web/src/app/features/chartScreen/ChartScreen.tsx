import React from 'react';
import InstrumentSelection from '../../../components/instrumentSelection/InstrumentSelection';
import { useInstrumentChartStore } from '@/stores/instrumentChart/store';
import DateRangePicker from '@/components/dateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { updateDateRange } from '@/stores/instrumentChart/action';
import Chart from './Chart';

const ChartScreen = () => {
    const instrumentName = useInstrumentChartStore.use.instrumentName();
    const instrumentExchange = useInstrumentChartStore.use.exchange();
    const tradingSymbol = useInstrumentChartStore.use.tradingSymbol();
    const fromDate = useInstrumentChartStore.use.fromDate();
    const toDate = useInstrumentChartStore.use.toDate();

    const handleDateChange = (range: DateRange | undefined) => {
        updateDateRange(range?.from || new Date(), range?.to || new Date());
    };

    return (
        <div className="flex flex-col gap-6 p-6 bg-gray-100 rounded-lg shadow-lg">
            <div className="text-center">
            {instrumentName ? (
                <h1 className="text-2xl font-bold text-blue-600">{instrumentName}</h1>
            ) : (
                <span className="text-red-500 font-bold">Select Stock</span>
            )}
                <p className="text-sm text-gray-500">
                    {tradingSymbol && instrumentExchange
                        ? `${tradingSymbol} | ${instrumentExchange}`
                        : tradingSymbol || instrumentExchange}
                </p>
            </div>
            <InstrumentSelection />
            <div className="flex flex-col gap-2 w-fit">
                <span className="text-sm font-medium text-gray-700">Select Dates</span>
                <DateRangePicker
                    value={{ from: fromDate, to: toDate }}
                    onChange={handleDateChange}
                />
            </div>
            <Chart />
        </div>
    );
};

export default ChartScreen;
