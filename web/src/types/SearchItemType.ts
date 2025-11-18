export type SearchItemType = {
    instrument_key: string;
    trading_symbol: string;
    short_name: string | null;
    name: string | null;
    instrument_type: string | null;
    isin: string | null;
    segment: string | null;
    exchange: string | null;
    score: number;
}