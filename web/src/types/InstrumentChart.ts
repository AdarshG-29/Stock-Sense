import { CANDLE_INTERVAL } from "@/constants/InstrumentChart";
import { UTCTimestamp } from "lightweight-charts";

export type OhlcCandleType = {
close: number;
open: number;
high: number;
low: number;
volume: number;
timeStamp: UTCTimestamp;
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
fromDate: Date;
toDate: Date;
isLoading: boolean;
isError: boolean;
}