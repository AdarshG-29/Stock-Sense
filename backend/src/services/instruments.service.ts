
import { pool } from "../db";
import { InstrumentResult, SearchOptions } from "../types/instrumentTypes";

/**
 * Search instruments with ranking:
 * 1. exact trading_symbol (case-insensitive)
 * 2. prefix match on trading_symbol (starts-with)
 * 3. exact isin
 * 4. substring match on trading_symbol (ILIKE %q%)
 * 5. full-text match on name (ts_rank)
 *
 * Uses parameterized query. Assumes indexes:
 * - lower(trading_symbol)
 * - isin
 * - instrument_type
 * - GIN tsvector on name
 */

export async function searchInstruments(opts: SearchOptions): Promise<InstrumentResult[]> {
  const qRaw = (opts.q ?? '').trim();
  if (!qRaw) return [];

  const qLower = qRaw.toLowerCase();
  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 200);
  const offset = Math.max(opts.offset ?? 0, 0);
  const instrumentTypeFilter = opts.instrument_type ?? '';

  // Build params array incrementally — every time we add a placeholder in SQL we push the value here.
  const params: any[] = [];

  // We'll assign placeholder numbers dynamically using params.length + 1

  // 1) qLower for exact/prefix checks
  params.push(qLower);
  const p_qLower = params.length; // $1

  // 2) qRaw for exact ISIN comparison
  params.push(qRaw);
  const p_qRaw = params.length; // $2

  // 3) substring pattern for ILIKE
  params.push(`%${qRaw}%`);
  const p_sub = params.length; // $3

  // 4) fulltext query arg
  params.push(qRaw);
  const p_ts = params.length; // $4

  // Optional: instrument_type filter. Only push if non-empty and we will include it in SQL.
  let instrumentTypeSQL = '';
  let p_type = -1;
  if (instrumentTypeFilter && instrumentTypeFilter.length > 0) {
    params.push(instrumentTypeFilter);
    p_type = params.length; // next placeholder number
    instrumentTypeSQL = `AND instrument_type = $${p_type}`;
  }

  // Finally push limit & offset
  params.push(limit);
  const p_limit = params.length;
  params.push(offset);
  const p_offset = params.length;

  // Build WHERE clauses (order doesn't matter as long as placeholders are correct)
  const whereClauses: string[] = [];
  whereClauses.push(`lower(trading_symbol) = $${p_qLower}`);                 // exact symbol
  whereClauses.push(`lower(trading_symbol) LIKE $${p_qLower} || '%'`);      // prefix
  whereClauses.push(`trading_symbol ILIKE $${p_sub}`);                      // substring
  whereClauses.push(`to_tsvector('english', coalesce(name, '')) @@ plainto_tsquery('english', $${p_ts})`); // name fulltext
  whereClauses.push(`isin = $${p_qRaw}`);                                   // exact isin

  const whereSQL = `(${whereClauses.join(' OR ')}) ${instrumentTypeSQL}`;

  const sql = `
    SELECT
      instrument_key,
      trading_symbol,
      short_name,
      name,
      instrument_type,
      isin,
      segment,
      exchange,
      (CASE
         WHEN lower(trading_symbol) = $${p_qLower} THEN 10000
         WHEN lower(trading_symbol) LIKE $${p_qLower} || '%' THEN 8000
         WHEN isin = $${p_qRaw} THEN 7000
         WHEN trading_symbol ILIKE $${p_sub} THEN 5000
         WHEN to_tsvector('english', coalesce(name,'')) @@ plainto_tsquery('english', $${p_ts})
           THEN (1000 + ts_rank(to_tsvector('english', coalesce(name,'')), plainto_tsquery('english', $${p_ts})) * 100)
         ELSE 0
       END) AS score
    FROM market_instruments
    WHERE ${whereSQL}
    ORDER BY score DESC, trading_symbol ASC
    LIMIT $${p_limit} OFFSET $${p_offset};
  `;

  try {
    const { rows } = await pool.query(sql, params);
    return rows as InstrumentResult[];
  } catch (err) {
    throw err;
  }
}
