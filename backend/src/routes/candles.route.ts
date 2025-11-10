import { Router } from "express";
import { HISTORIC_CANDLE_PATH, TODAY_CANDLE_PATH } from "../config/apiPaths";
import { getHistoricCandleData, getTodayCandleData } from "../controllers/candles.controller";

const router = Router();
router.get(HISTORIC_CANDLE_PATH, getHistoricCandleData);
router.get(TODAY_CANDLE_PATH, getTodayCandleData);

export default router;
