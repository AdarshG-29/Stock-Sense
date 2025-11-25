import { setStopPlaying, setTimeStampIndex } from '@/stores/backTestStore/action';
import { useBackTestStore } from '@/stores/backTestStore/store';
import { useInstrumentChartStore } from '@/stores/instrumentChart/store';
import {
    formatOhlcDataIntoChartData,
    formatVolumeDataIntoChartData,
    getLocalTimeStamp,
} from '@/utils/helper';
import {
    createChart,
    ColorType,
    CandlestickSeries,
    HistogramSeries,
    ISeriesApi,
    MouseEventParams,
} from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

export const useTradingView = () => {
    const [volumeInfo, setVolumeInfo] = useState<{ volume: number; color: string | undefined } | null>(null);
    const [xPosition, setXPosition] = useState<number | null>(null);

    const ohlcData = useInstrumentChartStore.use.ohlc();
    const isBacktestEnable = useBackTestStore.use.isBacktestEnable();
    const timeStampIndex = useBackTestStore.use.timeStampIndex();
    const isPlaying = useBackTestStore.use.isPlaying();
    const resetChart = useBackTestStore.use.resetChart();

    const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const lockChartRef = useRef<boolean>(false);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = initializeChart();
        setupCandlestickSeries();
        setupVolumeSeries();
        handleCrosshairMove();

        const handleResize = () => {
            if (chartContainerRef.current && chart) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);
        lockChartRef.current = false;

        return () => {
            window.removeEventListener('resize', handleResize);
            setVolumeInfo(null);
            clearIntervalIfExists();
            removeChart();
        };
    }, [ohlcData, isBacktestEnable]);

    useEffect(() => {
        handlePlayback();
    }, [isPlaying]);

    useEffect(() => {
        popCandles();
    }, [timeStampIndex]);

    useEffect(() => {
        resetCandles();
    }, [resetChart]);

    useEffect(() => {
        const chart = chartRef.current;
        const candleSeries = candleSeriesRef.current;

        if (!chart || !candleSeries || !isBacktestEnable) {
            return;
        }

        const handleCrosshairMove = (param: MouseEventParams) => addVerticalLineCrossshairMove(param, candleSeries);
        const handleClick = (param: MouseEventParams) => setTimeStampIndexSubscribeClick(param, candleSeries);

        chart.subscribeCrosshairMove(handleCrosshairMove);
        chart.subscribeClick(handleClick);

        return () => {
            chart.unsubscribeClick(handleCrosshairMove);
            chart.unsubscribeCrosshairMove(handleClick);
        };
    }, [isBacktestEnable]);

    const initializeChart = () => {
        const container = chartContainerRef.current;
        if (!container) return;
        const chart = createChart(container, {
            layout: {
                background: { type: ColorType.Solid },
            },
            width: container.clientWidth,
            height: 800,
        });
        chart.timeScale().fitContent();
        chart.applyOptions({
            timeScale: {
                timeVisible: true,
                tickMarkFormatter: getLocalTimeStamp,
            },
            localization: {
                timeFormatter: getLocalTimeStamp,
            },
        });
        chartRef.current = chart;
        return chart;
    };

    const removeChart = () => {
        const chart = chartRef.current;
        if (chart) {
            chart.remove();
            chartRef.current = null;
        }
    };

    const setupCandlestickSeries = () => {
        const chart = chartRef.current;
        if (!chart) return;

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            priceScaleId: 'right',
            priceFormat: {
                type: 'price',
            },
        });
        chart.priceScale('right').applyOptions({
            scaleMargins: {
                top: 0.1,
                bottom: 0.4,
            },
        });
        candlestickSeries.setData(ohlcData.map(formatOhlcDataIntoChartData));
        candleSeriesRef.current = candlestickSeries;
        return candlestickSeries;
    };

    const setupVolumeSeries = () => {
        const chart = chartRef.current;
        if (!chart) return;

        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceScaleId: 'volume',
            priceFormat: {
                type: 'volume',
            },
        });
        chart.priceScale('volume').applyOptions({
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });
        volumeSeries.setData(ohlcData.map(formatVolumeDataIntoChartData));
        volumeSeriesRef.current = volumeSeries;
        return volumeSeries;
    };

    const handleCrosshairMove = () => {
        const chart = chartRef.current;
        const volumeSeries = volumeSeriesRef.current;

        if (!chart || !volumeSeries) return;

        chart.subscribeCrosshairMove((param) => {
            if (param.seriesData.size) {
                const volume = param.seriesData.get(volumeSeries);
                if (volume && 'value' in volume && volume.value > 0) {
                    setVolumeInfo({ volume: volume.value, color: volume.color });
                }
            }
        });
    };

    const clearIntervalIfExists = () => {
        if (playbackIntervalRef.current) {
            clearInterval(playbackIntervalRef.current);
        }
    };

    const popCandles = () => {
        const candleSeries = candleSeriesRef.current;
        const volumeSeries = volumeSeriesRef.current;

        if (!candleSeries || !volumeSeries || timeStampIndex === null) return;
        const popCount = candleSeries.data().length - timeStampIndex - 1;
        if (popCount < 0) return;
        candleSeries.pop(popCount);
        volumeSeries.pop(popCount);
    };

    const handlePlayback = () => {
        const candleSeries = candleSeriesRef.current;
        const volumeSeries = volumeSeriesRef.current;

        if (!isPlaying || timeStampIndex === null || !candleSeries || !volumeSeries) {
            clearIntervalIfExists();
            return;
        }

        let currentIndex = timeStampIndex;
        playbackIntervalRef.current = setInterval(() => {
            if (currentIndex >= ohlcData.length - 1) {
                clearIntervalIfExists();
                currentIndex = 0;
                setStopPlaying();
                lockChartRef.current = false;
                return;
            }
            const newData = ohlcData[currentIndex + 1];
            candleSeries.update(formatOhlcDataIntoChartData(newData));
            volumeSeries.update(formatVolumeDataIntoChartData(newData));
            currentIndex += 1;
        }, 500);
    };

    const resetCandles = () => {
        const candleSeries = candleSeriesRef.current;
        const volumeSeries = volumeSeriesRef.current;

        if (!candleSeries || !volumeSeries || !resetChart) return;
        clearIntervalIfExists();
        lockChartRef.current = false;

        candleSeries.setData(ohlcData.map(formatOhlcDataIntoChartData));
        volumeSeries.setData(ohlcData.map(formatVolumeDataIntoChartData));
    };

    const addVerticalLineCrossshairMove = (param: MouseEventParams, candleSeries: ISeriesApi<'Candlestick'>) => {
        const { logical, point } = param;
        if (
            logical === undefined ||
            point === undefined ||
            logical < 0 ||
            logical >= candleSeries.data().length ||
            !isBacktestEnable ||
            timeStampIndex !== null ||
            lockChartRef.current
        ) {
            setXPosition(null);
            return;
        }
        setXPosition(point.x);
    };

    const setTimeStampIndexSubscribeClick = (param: MouseEventParams, candleSeries: ISeriesApi<'Candlestick'>) => {
        const { logical } = param;
        if (
            logical === undefined ||
            logical < 0 ||
            logical >= candleSeries.data().length ||
            !isBacktestEnable ||
            timeStampIndex !== null ||
            lockChartRef.current
        ) {
            return;
        }
        setTimeStampIndex(logical);
        lockChartRef.current = true;
    };

    return {
        chartContainerRef,
        volumeInfo,
        xPosition,
    };
};
