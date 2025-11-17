import { RawInstrument } from "../types/instrumentTypes";
import { safeInt, safeNumber, toTimestampTz } from "./helper";

export function mapInstrument(i: RawInstrument) {
    // Map from typical Upstox field names (be permissive)
    const instrument_key = i.instrument_key ?? null;
    const trading_symbol = (i.trading_symbol ?? '')?.toString() ?? '';
    const short_name = (i.short_name ?? '')?.toString() ?? '';
    const name = (i.name ?? '')?.toString() ?? '';
    const segment = (i.segment?? '')?.toString() ?? '';
    const exchange = (i.exchange ?? '')?.toString() ?? '';
    const isin = (i.isin ?? '')?.toString() ?? '';
    const instrument_type = (i.instrument_type ?? null);
    const security_type = (i.security_type ?? null);
  
    const lot_size = safeInt(i.lot_size ?? null);
    const minimum_lot = safeInt(i.minimum_lot ?? null);
    const freeze_quantity = safeInt(i.freeze_quantity ?? null);
    const qty_multiplier = safeInt(i.qty_multiplier ?? null);
  
    const tick_size = safeNumber(i.tick_size ?? null);
    const strike_price = safeNumber(i.strike_price ?? null);
  
    const expiry = toTimestampTz(i.expiry ?? null);
  
    const weekly = i.weekly ?? null;
  
    const intraday_margin = safeNumber(i.intraday_margin ?? null);
    const intraday_leverage = safeNumber(i.intraday_leverage ?? null);
    const mtf_enabled = i.mtf_enabled ?? null;
    const mtf_bracket = safeNumber(i.mtf_bracket ?? null);
  
    const exchange_token = (i.exchange_token ?? null);
    const underlying_symbol = (i.underlying_symbol ?? null);
    const underlying_key = (i.underlying_key ?? null);
    const underlying_type = (i.underlying_type ?? null);
  
    const raw = JSON.stringify(i);
  
    return {
      instrument_key,
      trading_symbol,
      short_name,
      name,
      segment,
      exchange,
      isin,
      instrument_type,
      security_type,
      lot_size,
      minimum_lot,
      freeze_quantity,
      qty_multiplier,
      tick_size,
      strike_price,
      expiry,
      weekly,
      intraday_margin,
      intraday_leverage,
      mtf_enabled,
      mtf_bracket,
      exchange_token,
      underlying_symbol,
      underlying_key,
      underlying_type,
      raw,
    };
  }