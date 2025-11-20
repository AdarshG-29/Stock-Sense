import { OhlcCandleType } from "@/types/InstrumentChart";
import { INITIAL_STATE, instrumentChartStore } from "./store";
import { CANDLE_INTERVAL, CANDLE_INTERVAL_OPTIONS } from "@/constants/InstrumentChart";
import { getHistoricalCandles, getTodayCandles } from "@/services/candles.api";

export const updateOhlcCandleData = async () => {
    const { instrumentKey, candleInterval, fromDate, toDate } = instrumentChartStore.getState();
    const { unit, interval } = CANDLE_INTERVAL_OPTIONS[candleInterval];

    instrumentChartStore.setState((state) => ({
        ...state,
        isLoading: true
    }));
    
    try {
        const res = fromDate === toDate
            ? await getTodayCandles({
                instrument_key: instrumentKey,
                unit,
                interval,
            })
            : 
            await getHistoricalCandles({
                instrument_key: instrumentKey,
                from_date: fromDate,
                to_date: toDate,
                unit,
                interval,
            })

        instrumentChartStore.setState((state) => ({
            ...state,
            isLoading: false,
            ohlc: (res?.data?.ohlcData?.candles ?? []) as OhlcCandleType[],
        }));

    } catch (error) {

        console.error("Error fetching historical candles:", error);
        instrumentChartStore.setState((state) => ({
            ...state,
            isError: true,
            isLoading: false
        }));
    }
};

export const setInstrumentData = ({
    instrument_key,
    instrument_type,
    trading_symbol,
    exchange,
    name,
}: {
    instrument_key: string;
    instrument_type: string;
    trading_symbol: string;
    exchange: string;
    name: string;
}) => {
    instrumentChartStore.setState((state) => ({
        ...state,
        instrumentKey: instrument_key,
        instrumentType: instrument_type,
        tradingSymbol: trading_symbol,
        exchange,
        instrumentName: name,
    }));
    updateOhlcCandleData();
};

export const updateCandleInterval = (candleInterval: CANDLE_INTERVAL) => {
    instrumentChartStore.setState((state) => ({
        ...state,
        candleInterval,
    }));
    updateOhlcCandleData();
};

export const updateDateRange = (fromDate: string, toDate: string) => {
    instrumentChartStore.setState((state) => ({
        ...state,
        fromDate,
        toDate,
    }));
    updateOhlcCandleData();
};

export const resetChartData = () => {
    instrumentChartStore.setState(INITIAL_STATE);
};