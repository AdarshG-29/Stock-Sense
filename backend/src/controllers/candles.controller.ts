import { Request, Response } from "express";
import NodeCache from "node-cache";
import { getCurrentTradingDayCandleData, getHistoricalCandleData } from "../api/upstox/upstox.service";

const cache = new NodeCache();
const ttl = 3600; //cache for 1 hour

export const getHistoricCandleData = async (req: Request, res: Response) => {
    const instrument_key = req.query.instrument_key as string;
    const unit = req.query.unit as string;
    const interval = req.query.interval as string;
    const to_date = req.query.to_date as string;
    const from_date = req.query.from_date as string | undefined;

    if(!instrument_key || !unit || !interval || Number.isNaN(Number(interval)) ||!to_date){
        return res.status(400).json({error: "Missing required parameters"});
    }

    const cacheKey = `candle_data_${instrument_key}_${unit}_${interval}_${to_date}_${from_date || ''}`;
    const cachedData = cache.get(cacheKey);
    if(cachedData){
        return res.json({data: cachedData, source: 'cache'});
    }
    
    try{
        const response = await getHistoricalCandleData({instrument_key, unit, interval: Number(interval), to_date, from_date});
        const {data, status} = response;
        const ohlcData = {
            candles: data.data.candles.map((candle: any[]) => ({
            timestamp: candle?.[0] ?? 0,
            open: candle?.[1] ?? 0,
            high: candle?.[2] ?? 0,
            low: candle?.[3] ?? 0,
            close: candle?.[4] ?? 0,
            volume: candle?.[5] ?? 0,
            derivativeCount: candle?.[6] ?? 0,
            })),
        };
        if(status === 200){
            cache.set(cacheKey, ohlcData, ttl); 
            return res.json({ohlcData, source: 'upstox'});
        }
    } catch(err){
        console.error("Error fetching Upstox data:", err);
    }
}

export const getTodayCandleData = async (req: Request, res: Response) => {
    const instrument_key = req.query.instrument_key as string;
    const unit = req.query.unit as string;
    const interval = req.query.interval as string;

    if(!instrument_key || !unit || !interval || Number.isNaN(Number(interval))){
        return res.status(400).json({error: "Missing required parameters"});
    }

    const cacheKey = `candle_data_today_${instrument_key}_${unit}_${interval}`;
    const cachedData = cache.get(cacheKey);
    if(cachedData){
        return res.json({data: cachedData, source: 'cache'});
    }
    
    try{
        const response = await getCurrentTradingDayCandleData({instrument_key, unit, interval: Number(interval)});
        const {data, status} = response;
        const ohlcData = {
            candles: data.data.candles.map((candle: any[]) => ({
            timestamp: candle?.[0] ?? 0,
            open: candle?.[1] ?? 0,
            high: candle?.[2] ?? 0,
            low: candle?.[3] ?? 0,
            close: candle?.[4] ?? 0,
            volume: candle?.[5] ?? 0,
            derivativeCount: candle?.[6] ?? 0,
            })),
        };
        if(status === 200){
            cache.set(cacheKey, ohlcData, ttl); 
            return res.json({ohlcData, source: 'upstox'});
        }
    } catch(err){
        console.error("Error fetching Upstox data:", err);
    }
}