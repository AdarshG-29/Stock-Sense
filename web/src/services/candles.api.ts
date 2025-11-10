import axiosInstance from "@/lib/axiosInstance";

export const getHistoricalCandles = async () => {
    const url = `/candles/historic`;
    const params = new URLSearchParams({
        instrument_key: 'NSE_EQ|INE848E01016',
        unit: 'minutes',
        interval: '5',
        to_date: '2025-10-01'
    });

    return axiosInstance.get(`${url}?${params.toString()}`);
}

export const getTodayCandles = async () => {
    const url = `/candles/today`;
    const params = new URLSearchParams({
        instrument_key: 'NSE_EQ|INE848E01016',
        unit: 'minutes',
        interval: '5'
    });

    return axiosInstance.get(`${url}?${params.toString()}`);
}