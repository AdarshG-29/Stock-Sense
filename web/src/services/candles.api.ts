import axiosInstance from "@/lib/axiosInstance";

export const getHistoricalCandles = async (
    {
        instrument_key,
        unit,
        interval,
        from_date,
        to_date,
    }: {
        instrument_key: string;
        unit: string;
        interval: number;
        from_date: string; // format: 'YYYY-MM-DD'
        to_date?: string; // format: 'YYYY-MM-DD'
    }
) => {
    const url = `/candles/historic`;
    const params = new URLSearchParams({
        instrument_key,
        unit,
        interval: interval.toString(),
        from_date,
        ...(to_date && to_date.length > 0 ? { to_date } : {}),
    });

    return axiosInstance.get(`${url}?${params.toString()}`);
};

export const getTodayCandles = async ({
    instrument_key,
    unit,
    interval,
}: {
    instrument_key: string;
    unit: string;
    interval: number;
}) => {
    const url = `/candles/today`;
    const params = new URLSearchParams({
        instrument_key,
        unit,
        interval: interval.toString(),
    });

    return axiosInstance.get(`${url}?${params.toString()}`);
};