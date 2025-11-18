import axiosInstance from "@/lib/axiosInstance";

export const getHistoricalCandles = async (instrument_key: string) => {
    const url = `/candles/historic`;
    const params = new URLSearchParams({
        instrument_key,
        unit: 'minutes',
        interval: '5',
        from_date: '2025-11-17',
        to_date: '2025-11-17'
    });

    return axiosInstance.get(`${url}?${params.toString()}`);
}

export const getTodayCandles = async (instrument_key: string) => {
    const url = `/candles/today`;
    const params = new URLSearchParams({
        instrument_key,
        unit: 'minutes',
        interval: '5'
    });

    return axiosInstance.get(`${url}?${params.toString()}`);
}