import fs from 'fs';
import path from 'path';
import { pool } from '../db'; // adapt relative path if needed
import { RawInstrument } from '../types/instrumentTypes';
import { mapInstrument } from '../utils/dtoMappings';


// Build parameterized batch INSERT ... ON CONFLICT query for chunk rows
function buildUpsertQuery(rows: Record<string, any>[]) {
  // columns in exact order
  const cols = [
    'instrument_key', 'trading_symbol', 'short_name', 'name', 'segment', 'exchange', 'isin',
    'instrument_type', 'security_type', 'lot_size', 'minimum_lot', 'freeze_quantity', 'qty_multiplier',
    'tick_size', 'strike_price', 'expiry', 'weekly', 'intraday_margin', 'intraday_leverage',
    'mtf_enabled', 'mtf_bracket', 'exchange_token', 'underlying_symbol', 'underlying_key',
    'underlying_type', 'raw'
  ];

  const valuePlaceholders: string[] = [];
  const values: any[] = [];
  let paramIdx = 1;

  for (const r of rows) {
    const placeholders = cols.map(() => `$${paramIdx++}`);
    valuePlaceholders.push(`(${placeholders.join(',')})`);
    for (const c of cols) {
      let v = r[c];
      // Postgres expects boolean null -> null, strings -> as-is, raw JSON -> JSON string
      values.push(v === undefined ? null : v);
    }
  }

  const insertCols = cols.join(', ');
  const valuesSQL = valuePlaceholders.join(',\n');

  // Build ON CONFLICT update set (exclude primary key)
  const updates = cols
    .filter(c => c !== 'instrument_key')
    .map(c => `${c} = EXCLUDED.${c}`)
    .join(',\n  ');

  const sql = `
    INSERT INTO market_instruments (${insertCols})
    VALUES
    ${valuesSQL}
    ON CONFLICT (instrument_key) DO UPDATE
    SET
      ${updates},
      updated_at = now();
  `;

  return { sql, values };
}

//reading json file
async function readJsonFile(filePath: string): Promise<RawInstrument[]> {
    const txt = await fs.promises.readFile(filePath, 'utf8');
    const parsed = JSON.parse(txt);
    if (Array.isArray(parsed)) return parsed;
    if (parsed?.instruments && Array.isArray(parsed.instruments)) return parsed.instruments;
    if (Array.isArray(Object.values(parsed))) return Object.values(parsed);
    throw new Error('Unexpected JSON structure');
}

async function main() {
  const args = process.argv.slice(2);
  if (!args || args.length < 1) {
    console.error('Usage: npx ts-node src/scripts/uploadInstruments.ts <path-to-instruments.json|.gz>');
    process.exit(1);
  }
  const filePath = path.resolve(args[0] ?? '');
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  console.log('Reading instruments from:', filePath);
  const rawInstruments = await readJsonFile(filePath);
  console.log('Total instruments read:', rawInstruments.length);

  const mapped = rawInstruments.map(mapInstrument).filter(r => r.instrument_key); // drop missing keys
  console.log('Total instruments with instrument_key:', mapped.length);

  if (mapped.length === 0) {
    console.log('No valid instruments to upload. Exiting.');
    process.exit(0);
  }

  const client = await pool.connect();
  try {
    const chunkSize = 1000; // tuneable
    let inserted = 0;
    console.log(`Uploading in chunks of ${chunkSize}...`);
    await client.query('BEGIN');

    for (let i = 0; i < mapped.length; i += chunkSize) {
      const chunk = mapped.slice(i, i + chunkSize);
      const { sql, values } = buildUpsertQuery(chunk);
      await client.query(sql, values);
      inserted += chunk.length;
      console.log(`Upserted ${inserted}/${mapped.length}`);
    }

    await client.query('COMMIT');
    console.log('Upload completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error during upload, rolled back. Error:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    // close pool if this script is one-off
    await pool.end();
  }
}

main().catch(err => {
  console.error('Fatal error', err);
  process.exit(1);
});
