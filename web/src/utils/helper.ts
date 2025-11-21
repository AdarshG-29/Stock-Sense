import { VOLUME_COLOR_CONSTANTS } from "@/constants/chart";
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

export const checkTodayDateRange = (fromDate: Date, toDate: Date): boolean => {
  return checkIfDateIsToday(fromDate) && checkIfDateIsToday(toDate);
};

export const getLocalTimeStamp = (time: UTCTimestamp): string => {
  return new Date((time as number) * 1000).toLocaleTimeString(); // Format to show local time
};

export const getUtcTimeStamp = (timestamp: string): UTCTimestamp => {
  return Math.floor(new Date(timestamp).getTime() / 1000) as UTCTimestamp; // Convert to seconds
};

export const formatOhlcDataIntoChartData = (ohlcData: OhlcCandleType[]) => {
  return ohlcData
    .map((item) => ({
      time: getUtcTimeStamp(item.timestamp),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }))
    .sort((a, b) => a.time - b.time);
};

export const formatVolumeDataIntoChartData = (ohlcData: OhlcCandleType[]) => {
  return ohlcData
    .map((item) => ({
      time: getUtcTimeStamp(item.timestamp),
      value: item.volume,
      color: item.close >= item.open ? VOLUME_COLOR_CONSTANTS.BAR_UP_COLOR : VOLUME_COLOR_CONSTANTS.BAR_DOWN_COLOR,
    }))
    .sort((a, b) => a.time - b.time);
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