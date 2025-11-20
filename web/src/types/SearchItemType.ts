export type SearchItemType = {
    instrument_key: string;
    trading_symbol: string;
    name: string;
    short_name: string | null;
    instrument_type: string | null;
    isin: string | null;
    segment: string | null;
    exchange: string | null;
    score: number;
}