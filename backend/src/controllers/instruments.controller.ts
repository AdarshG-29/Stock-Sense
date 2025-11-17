import { Request, Response } from 'express';
import { searchInstruments } from '../services/instruments.service';

export async function searchInstrumentHandler(req: Request, res: Response) {
  try {
    const q = (req.query.q as string) ?? '';
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'query parameter q is required' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
    const instrument_type = req.query.instrument_type ? String(req.query.instrument_type) : '';

    const results = await searchInstruments({
      q,
      limit,
      offset,
      instrument_type,
    });

    return res.json({
      query: q,
      count: results.length,
      results,
    });

  } catch (err: any) {
    console.error('Search error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
