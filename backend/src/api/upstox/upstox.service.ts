import axiosInstance from "../axiosInstance";

export const getAccessToken = async () => {
    return process.env.UPSTOX_ACCESS_TOKEN || '';
};

export const getHeaders = async () => {
    const accessToken = await getAccessToken();
    return {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
};

export const getHistoricalCandleData = async ({
    instrument_key,
    unit,
    interval,
    to_date,
    from_date,
}: {
    instrument_key: string;
    unit: string;
    interval: number;
    to_date: string; // format: 'YYYY-MM-DD'
    from_date: string | undefined; // format: 'YYYY-MM-DD'
}) => {
    const url = `/historical-candle/${instrument_key}/${unit}/${interval}/${to_date}${from_date ? `/${from_date}` : ''}`;
    const headers = await getHeaders();
    return axiosInstance.get(url, { headers });
};

export const getCurrentTradingDayCandleData = async ({
    instrument_key,
    unit,
    interval,
}: {
    instrument_key: string;
    unit: string;
    interval: number;
}) => {
    const url = `/historical-candle/intraday/${instrument_key}/${unit}/${interval}`;
    const headers = await getHeaders();
    return axiosInstance.get(url, { headers });
};
