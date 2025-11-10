import { Request, Response } from "express";
import NodeCache from "node-cache";
import { getCurrentTradingDayCandleData, getHistoricalCandleData } from "../api/upstox/upstox.service";

const cache = new NodeCache();
const ttl = 3600; //cache for 1 hour

export const getHistoricCandleData = async (req: Request, res: Response) => {
    const {instrument_key, unit, interval, to_date, from_date} = req.body;  

    if(!instrument_key || !unit || !interval || !to_date){
        return res.status(400).json({error: "Missing required parameters"});
    }

    const cacheKey = `candle_data_${instrument_key}_${unit}_${interval}_${to_date}_${from_date || ''}`;
    const cachedData = cache.get(cacheKey);
    if(cachedData){
        return res.json({data: cachedData, source: 'cache'});
    }
    
    try{
        const response = await getHistoricalCandleData({instrument_key: encodeURIComponent(instrument_key), unit, interval, to_date, from_date});
        const {data, status} = response;
        if(status === 200){
            cache.set(cacheKey, data, ttl); 
            return res.json({data, source: 'upstox'});
        }
    } catch(err){
        console.error("Error fetching Upstox data:", err);
    }
}

export const getTodayCandleData = async (req: Request, res: Response) => {
    const {instrument_key, unit, interval} = req.body;  

    if(!instrument_key || !unit || !interval){
        return res.status(400).json({error: "Missing required parameters"});
    }

    const cacheKey = `candle_data_today_${instrument_key}_${unit}_${interval}`;
    const cachedData = cache.get(cacheKey);
    if(cachedData){
        return res.json({data: cachedData, source: 'cache'});
    }
    
    try{
        const response = await getCurrentTradingDayCandleData({instrument_key: encodeURIComponent(instrument_key), unit, interval});
        const {data, status} = response;
        if(status === 200){
            cache.set(cacheKey, data, ttl); 
            return res.json({data, source: 'upstox'});
        }
    } catch(err){
        console.error("Error fetching Upstox data:", err);
    }
}