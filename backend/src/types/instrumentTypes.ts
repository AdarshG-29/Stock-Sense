export type RawInstrument = { [k: string]: any };

export type InstrumentResult = {
    instrument_key: string;
    trading_symbol: string;
    short_name: string | null;
    name: string | null;
    instrument_type: string | null;
    isin: string | null;
    segment: string | null;
    exchange: string | null;
    score: number;
  };

export type SearchOptions = {
    q: string;
    limit?: number;
    offset?: number;
    instrument_type?: string | null;
};
