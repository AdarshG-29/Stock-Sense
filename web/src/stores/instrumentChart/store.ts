import { CANDLE_INTERVAL } from "@/constants/InstrumentChart";
import { createSelectors } from "@/lib/zustandCreateSelectors";
import { InstrumentChartData } from "@/types/InstrumentChart";
import { dateFormatter } from "@/utils/helper";
import { create } from "zustand";

export const INITIAL_STATE: InstrumentChartData = {
tradingSymbol: '',
exchange: '',
instrumentKey: '',
instrumentName: '',
instrumentType: '',
ohlc: [],
candleInterval: CANDLE_INTERVAL.FIVE_MINUTES,
fromDate: dateFormatter(new Date()), // format: 'YYYY-MM-DD'
toDate: dateFormatter(new Date()), // format: 'YYYY-MM-DD'
isError: false,
isLoading: false
}

export const instrumentChartStore = create<InstrumentChartData>(() => (INITIAL_STATE));

export const useInstrumentChartStore = createSelectors(instrumentChartStore);