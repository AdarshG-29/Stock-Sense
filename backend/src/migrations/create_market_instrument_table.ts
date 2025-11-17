import {pool} from '../db';

async function runMigration() {
    try{
        console.log('Starting migration: create market_instruments table and indexes...');

        //creating market instrument table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS market_instruments (
        instrument_key       TEXT PRIMARY KEY,
        trading_symbol       TEXT NOT NULL,
        short_name           TEXT,
        name                 TEXT,
        segment              TEXT NOT NULL,
        exchange             TEXT,
        isin                 TEXT,
        instrument_type      TEXT,
        security_type        TEXT,
        lot_size             INTEGER,
        minimum_lot          INTEGER,
        freeze_quantity      INTEGER,
        qty_multiplier       INTEGER,
        tick_size            NUMERIC,
        strike_price         NUMERIC,
        expiry               TIMESTAMPTZ,
        weekly               BOOLEAN,
        intraday_margin      NUMERIC,
        intraday_leverage    NUMERIC,
        mtf_enabled          BOOLEAN,
        mtf_bracket          NUMERIC,
        exchange_token       TEXT,
        underlying_symbol    TEXT,
        underlying_key       TEXT,
        underlying_type      TEXT,
        raw                  JSONB NOT NULL,
        updated_at           TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('market_instruments table created successfully.');

    //creating indexes
    await pool.query(`
        -- case-insensitive / prefix-friendly index on trading_symbol
        CREATE INDEX IF NOT EXISTS idx_instruments_trading_symbol_lower
          ON market_instruments (lower(trading_symbol));
      `);
      console.log('Index idx_instruments_trading_symbol_lower ensured.');

      await pool.query(`
        -- exact lookup on isin
        CREATE INDEX IF NOT EXISTS idx_instruments_isin
          ON market_instruments (isin);
      `);
      console.log('Index idx_instruments_isin ensured.');
  
      await pool.query(`
        -- filter on instrument_type
        CREATE INDEX IF NOT EXISTS idx_instruments_instrument_type
          ON market_instruments (instrument_type);
      `);
      console.log('Index idx_instruments_instrument_type ensured.');
  
      await pool.query(`
        -- full-text index on name for word-based searches
        CREATE INDEX IF NOT EXISTS idx_instruments_name_fts
          ON market_instruments USING GIN (to_tsvector('english', coalesce(name, '')));
      `);
      console.log('Index idx_instruments_name_fts ensured.');
  
      console.log('Migration completed successfully.');
}
catch (err) {
    console.error('Error running migration:', err);
    process.exitCode = 1;
  } finally {
    console.log('Closing DB pool.');
    await pool.end();
  }
}

runMigration();