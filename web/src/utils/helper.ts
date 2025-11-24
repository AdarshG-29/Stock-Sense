import { VOLUME_COLOR_CONSTANTS } from "@/constants/chart";
import { CANDLE_INTERVAL } from "@/constants/InstrumentChart";
import { OhlcCandleType } from "@/types/InstrumentChart";
import { UTCTimestamp } from "lightweight-charts";

export const dateFormatter = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Returns in YYYY-MM-DD format
};

export const checkIfDateIsToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const checkCandleIntervalForToday = (candleInterval: CANDLE_INTERVAL) => {
  const intervalsMoreThanADay = [
    CANDLE_INTERVAL.ONE_MINUTE,
    CANDLE_INTERVAL.THREE_MINUTES,
    CANDLE_INTERVAL.THIRTY_MINUTES,
    CANDLE_INTERVAL.FIVE_MINUTES,
    CANDLE_INTERVAL.FIFTEEN_MINUTES,
    CANDLE_INTERVAL.ONE_HOUR,
    CANDLE_INTERVAL.FOUR_HOURS,
  ];
  return intervalsMoreThanADay.includes(candleInterval);
}

export const checkTodayDateRange = (fromDate: Date, toDate: Date): boolean => {
  return checkIfDateIsToday(fromDate) && checkIfDateIsToday(toDate);
};

export const getLocalTimeStamp = (time: UTCTimestamp): string => {
  return new Date((time as number) * 1000).toLocaleTimeString(); // Format to show local time
};

export const getUtcTimeStamp = (timestamp: string): UTCTimestamp => {
  return Math.floor(new Date(timestamp).getTime() / 1000) as UTCTimestamp; // Convert to seconds
};

export const formatOhlcData = (ohlcData: any): OhlcCandleType[] => {
  if(!ohlcData || !Array.isArray(ohlcData)) {
    return [];
  }
  return ohlcData
    .map((item) => ({
      timeStamp: getUtcTimeStamp(item?.timestamp ?? ''),
      open: item?.open ?? 0,
      high: item?.high ?? 0,
      low: item?.low ?? 0,
      close: item?.close ?? 0,
      volume: item?.volume ?? 0,
      openInterest: item?.openInterest ?? 0,
    }))
    .sort((a, b) => a.timeStamp - b.timeStamp);
};

export const formatOhlcDataIntoChartData = (ohlcData: OhlcCandleType) => {
  const { timeStamp, open, high, low, close } = ohlcData;
  return ({
      time: timeStamp,
      open: open,
      high: high,
      low: low,
      close: close,
    })
}

export const formatVolumeDataIntoChartData = (ohlcData: OhlcCandleType) => {
  const { timeStamp, open, close, volume } = ohlcData;
 
  return ({
      time: timeStamp,
      value: volume,
      color: close >= open ? VOLUME_COLOR_CONSTANTS.BAR_UP_COLOR : VOLUME_COLOR_CONSTANTS.BAR_DOWN_COLOR,
    })
};

export const getformattedVolume = (volume: number): string => {
  if (volume >= 1_000_000) {
    return (volume / 1_000_000).toFixed(2) + 'M';
  } else if (volume >= 1_000) {
    return (volume / 1_000).toFixed(2) + 'K';
  } else {
    return volume.toString();
  }
};