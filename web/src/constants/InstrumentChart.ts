export enum CANDLE_INTERVAL {
    ONE_MINUTE = '1 minute',
    THREE_MINUTES = '3 minutes',
    FIVE_MINUTES = '5 minutes',
    FIFTEEN_MINUTES = '15 minutes',
    THIRTY_MINUTES = '30 minutes',
    ONE_HOUR = '1 hour',
    FOUR_HOURS = '4 hours',
    ONE_DAY = '1 day',
    ONE_WEEK = '1 week',
    ONE_MONTH = '1 month'
}

export const CANDLE_INTERVAL_OPTIONS = {
    [CANDLE_INTERVAL.ONE_MINUTE]: {
        unit: 'minutes',
        interval: 1,
    },
    [CANDLE_INTERVAL.THREE_MINUTES]: {
        unit: 'minutes',
        interval: 3,
    },
    [CANDLE_INTERVAL.FIVE_MINUTES]: {
        unit: 'minutes',
        interval: 5,
    },
    [CANDLE_INTERVAL.FIFTEEN_MINUTES]: {
        unit: 'minutes',
        interval: 15,
    },
    [CANDLE_INTERVAL.THIRTY_MINUTES]: {
        unit: 'minutes',
        interval: 30,
    },
    [CANDLE_INTERVAL.ONE_HOUR]: {
        unit: 'hours',
        interval: 1,
    },
    [CANDLE_INTERVAL.FOUR_HOURS]: {
        unit: 'hours',
        interval: 4,
    },
    [CANDLE_INTERVAL.ONE_DAY]: {
        unit: 'days',
        interval: 1,
    },
    [CANDLE_INTERVAL.ONE_WEEK]: {
        unit: 'weeks',
        interval: 1,
    },
    [CANDLE_INTERVAL.ONE_MONTH]: {
        unit: 'months',
        interval: 1,
    }
};