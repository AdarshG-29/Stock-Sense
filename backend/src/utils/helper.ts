export function safeNumber(v: any): number | null {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

export function safeInt(v: any): number | null {
    if (v === null || v === undefined || v === '') return null;
    const n = parseInt(v as any, 10);
    return Number.isFinite(n) ? n : null;
}

export function toTimestampTz(msOrVal: any): string | null {
    if (!msOrVal && msOrVal !== 0) return null;

    // Upstox expiry often in milliseconds; handle numbers and strings
    const asNum = typeof msOrVal === 'string' && /^\d+$/.test(msOrVal) ? Number(msOrVal) : msOrVal;
    const date = new Date(asNum);
    
    if (isNaN(date.getTime())) return null;
    return date.toISOString(); // Postgres will accept ISO timestamp
}