import { Router } from "express";
import { searchInstrumentHandler } from "../controllers/instruments.controller";
import { SEARCH_PATH } from "../config/apiPaths";

const router = Router();
router.get(SEARCH_PATH, searchInstrumentHandler);

export default router;
