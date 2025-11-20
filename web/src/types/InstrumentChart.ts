import { CANDLE_INTERVAL } from "@/constants/InstrumentChart";

export type OhlcCandleType = {
close: number;
open: number;
high: number;
low: number;
volume: number;
timestamp: string;
openInterest: number;
}

export type InstrumentChartData = {
instrumentKey: string;
instrumentName: string;
exchange: string;
tradingSymbol: string;
instrumentType: string;
ohlc: OhlcCandleType[];
candleInterval: CANDLE_INTERVAL;
fromDate: string;
toDate: string;
isLoading: boolean;
isError: boolean;
}