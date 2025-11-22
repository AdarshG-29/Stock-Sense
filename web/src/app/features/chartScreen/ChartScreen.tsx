import React from 'react';
import InstrumentSelection from '../../../components/instrumentSelection/InstrumentSelection';
import { useInstrumentChartStore } from '@/stores/instrumentChart/store';
import DateRangePicker from '@/components/dateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { updateCandleInterval, updateDateRange } from '@/stores/instrumentChart/action';
import Chart from './Chart';
import Dropdown from '@/components/dropdown/Dropdown';
import { CANDLE_INTERVAL } from '@/constants/InstrumentChart';

const ChartScreen = () => {
    const instrumentName = useInstrumentChartStore.use.instrumentName();
    const instrumentExchange = useInstrumentChartStore.use.exchange();
    const tradingSymbol = useInstrumentChartStore.use.tradingSymbol();
    const fromDate = useInstrumentChartStore.use.fromDate();
    const toDate = useInstrumentChartStore.use.toDate();
    const candleInterval = useInstrumentChartStore.use.candleInterval();

    const handleDateChange = (range: DateRange | undefined) => {
        updateDateRange(range?.from || new Date(), range?.to || new Date());
    };

    const handleOnCandleIntervalChange = (value: string) => {
        updateCandleInterval(value as CANDLE_INTERVAL);
    };

    return (
        <div className="flex flex-col w-full gap-4 p-6 bg-gray-100 rounded-lg shadow-lg">
            <div className="flex w-full justify-between items-center">
                <div className="flex flex-col justify-center gap-1">
                    {instrumentName ? (
                        <h2 className="text-xl font-bold text-blue-600">{instrumentName}</h2>
                    ) : (
                        <span className="text-xl text-red-500 font-bold">Select Stock</span>
                    )}
                    <p className="text-sm text-gray-500">
                        {tradingSymbol && instrumentExchange
                            ? `${tradingSymbol} | ${instrumentExchange}`
                            : tradingSymbol || instrumentExchange}
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <InstrumentSelection />
                    <DateRangePicker
                        value={{ from: fromDate, to: toDate }}
                        onChange={handleDateChange}
                    />
                    <Dropdown
                        value={candleInterval}
                        options={Object.values(CANDLE_INTERVAL).map((item) => ({
                            label: item,
                            value: item,
                        }))}
                        onValueChange={handleOnCandleIntervalChange}
                        label="Candle Interval"
                        placeholder="select candle interval"
                    />
                </div>
            </div>
            <Chart />
        </div>
    );
};

export default ChartScreen;
