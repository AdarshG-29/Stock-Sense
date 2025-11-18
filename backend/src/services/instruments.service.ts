import { pool } from "../db";
import { InstrumentResult, SearchOptions } from "../types/instrumentTypes";

/**
 * Search instruments with ranking:
 * 1. exact trading_symbol (case-insensitive)
 * 2. prefix match on trading_symbol (starts-with)
 * 3. exact isin
 * 4. substring match on trading_symbol or name (ILIKE %q%)
 * 5. full-text match on name (ts_rank)
 *
 * Uses parameterized query. Assumes indexes:
 * - lower(trading_symbol)
 * - isin
 * - instrument_type
 * - GIN tsvector on name (idx_instruments_name_fts)
 * - (optional) trigram on name for ILIKE '%...%' if you add it
 */

export async function searchInstruments(opts: SearchOptions): Promise<InstrumentResult[]> {
  const qRaw = (opts.q ?? "").trim();
  if (!qRaw) return [];

  const qLower = qRaw.toLowerCase();
  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 200);
  const offset = Math.max(opts.offset ?? 0, 0);
  const instrumentTypeFilter = opts.instrument_type ?? "";

  // Build params array incrementally — each time we add a placeholder in SQL,
  // we push the corresponding value here.
  const params: any[] = [];

  // 1) lower-cased query for exact/prefix symbol matches
  params.push(qLower);
  const p_qLower = params.length; // $1

  // 2) raw query for exact ISIN (case-sensitive is fine here)
  params.push(qRaw);
  const p_qRaw = params.length; // $2

  // 3) substring pattern for ILIKE on symbol + name
  params.push(`%${qRaw}%`);
  const p_sub = params.length; // $3

  // 4) full-text query arg (used in plainto_tsquery)
  params.push(qRaw);
  const p_ts = params.length; // $4

  // Optional: instrument_type filter. Only add if non-empty.
  let instrumentTypeSQL = "";
  let p_type = -1;
  if (instrumentTypeFilter && instrumentTypeFilter.length > 0) {
    params.push(instrumentTypeFilter);
    p_type = params.length; // next placeholder number
    instrumentTypeSQL = `AND instrument_type = $${p_type}`;
  }

  // Finally: limit & offset
  params.push(limit);
  const p_limit = params.length; // next placeholder
  params.push(offset);
  const p_offset = params.length; // next placeholder

  // WHERE clauses:
  const whereClauses: string[] = [];

  // exact symbol (case-insensitive)
  whereClauses.push(`lower(trading_symbol) = $${p_qLower}`);

  // prefix symbol
  whereClauses.push(`lower(trading_symbol) LIKE $${p_qLower} || '%'`);

  // substring on symbol
  whereClauses.push(`trading_symbol ILIKE $${p_sub}`);

  // 🔹 substring on name (for queries like "voda" → "Vodafone Idea")
  whereClauses.push(`name ILIKE $${p_sub}`);

  // full-text on name
  whereClauses.push(
    `to_tsvector('english', coalesce(name, '')) @@ plainto_tsquery('english', $${p_ts})`
  );

  // exact ISIN
  whereClauses.push(`isin = $${p_qRaw}`);

  const whereSQL = `(${whereClauses.join(" OR ")}) ${instrumentTypeSQL}`;

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
         WHEN lower(trading_symbol) = $${p_qLower} THEN 10000                    -- exact symbol
         WHEN lower(trading_symbol) LIKE $${p_qLower} || '%' THEN 8000          -- prefix symbol
         WHEN isin = $${p_qRaw} THEN 7000                                       -- exact ISIN
         WHEN name ILIKE $${p_sub} THEN 6000                                    -- substring in name
         WHEN trading_symbol ILIKE $${p_sub} THEN 5000                          -- substring in symbol
         WHEN to_tsvector('english', coalesce(name,'')) @@ plainto_tsquery('english', $${p_ts})
           THEN (1000 + ts_rank(
                        to_tsvector('english', coalesce(name,'')),
                        plainto_tsquery('english', $${p_ts})
                    ) * 100)
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
    console.log("Error in searchInstruments:", err);
    throw err;
  }
}
