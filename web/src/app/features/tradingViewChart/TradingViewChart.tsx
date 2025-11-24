import { VOLUME_COLOR_CONSTANTS } from '@/constants/chart';
import { OhlcCandleType } from '@/types/InstrumentChart';
import {
    formatOhlcDataIntoChartData,
    formatVolumeDataIntoChartData,
    getformattedVolume,
    getLocalTimeStamp,
} from '@/utils/helper';
import {
    createChart,
    ColorType,
    CandlestickSeries,
    HistogramSeries,
    ISeriesApi,
} from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

type Props = {
    ohlcData: OhlcCandleType[];
    timeStampIndex: number | null;
    isPlaying: boolean;
    resetChart: boolean;
    stopReplay: () => void;
    isBacktestEnable: boolean;
};

const TradingViewChart = (props: Props) => {
    const [volumeInfo, setVolumeInfo] = useState<{ volume: number; color: string | undefined } | null>(null);
    const [hoveredTime, setHoveredTime] = useState<number | null>(null);
    const [xPosition, setXPosition] = useState<number | null>(null);

    const { isPlaying, timeStampIndex, ohlcData, stopReplay, resetChart, isBacktestEnable } = props;
    
    const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;
        
        const chart = initializeChart();
        setupCandlestickSeries();
        setupVolumeSeries();
        handleCrosshairMove();
        addVerticalLineCrossshairMove();

        const handleResize = () => {
            if (chartContainerRef.current && chart) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            setVolumeInfo(null);
            clearIntervalIfExists();
            removeChart();
        };

    },[ohlcData])

    useEffect(() => {
            handlePlayback();
    },[isPlaying])

    useEffect(() => {
            popCandles();
    }, [timeStampIndex]);

    useEffect(() => {
        resetCandles();
    },[resetChart])

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
    }

    const setupCandlestickSeries = () => {
        const chart = chartRef.current
        if(!chart)
            return;

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
        const chart = chartRef.current
        if(!chart)
            return;

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

    const handleCrosshairMove = (
    ) => {
        const chart = chartRef.current;
        const volumeSeries = volumeSeriesRef.current;

        if(!chart || !volumeSeries)
            return;

        chart.subscribeCrosshairMove((param) => {
            if (param.seriesData.size) {
                const volume = param.seriesData.get(volumeSeries);
                if (volume && 'value' in volume && volume.value > 0) {
                    setVolumeInfo({ volume: volume.value, color: volume.color });
                }
            }
        })
    };

    const clearIntervalIfExists = () => {
        if (playbackIntervalRef.current) {
            clearInterval(playbackIntervalRef.current);
        }
    };

    const popCandles = () => {
        const candleSeries = candleSeriesRef.current;
        const volumeSeries = volumeSeriesRef.current;

        if(!candleSeries || !volumeSeries || timeStampIndex === null) return;
        const popCount = candleSeries.data().length - timeStampIndex - 1;
        if(popCount < 0) return;
        candleSeries.pop(popCount);
        volumeSeries.pop(popCount);
    }

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
                stopReplay();
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

        if(!candleSeries || !volumeSeries || !resetChart) return;
        clearIntervalIfExists();
        candleSeries.setData(ohlcData.map(formatOhlcDataIntoChartData));
        volumeSeries.setData(ohlcData.map(formatVolumeDataIntoChartData));
    }

    const addVerticalLineCrossshairMove = () => {
        const chart = chartRef.current;
        const candleSeries = candleSeriesRef.current;

        if (!chart || !candleSeries) return;

        chart.subscribeCrosshairMove((param) => {
            const {logical, point} = param;
            if(
                logical === undefined || 
                point === undefined ||
                 logical<0 ||
                  logical >= candleSeries.data().length || 
                  !isBacktestEnable
                ) {
                setHoveredTime(null);
                setXPosition(null);
                return;
            }
                setHoveredTime(logical);
                setXPosition(point.x);
        });
    };
    return (
        <div ref={chartContainerRef} className="relative w-full h-full">
            {volumeInfo?.volume && (
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 font-bold text-sm">
                <span>Vol: </span>
                <span
                className="font-semibold"
                style={{
                    color:
                    volumeInfo?.color === VOLUME_COLOR_CONSTANTS.BAR_UP_COLOR
                        ? VOLUME_COLOR_CONSTANTS.TEXT_UP_COLOR
                        : VOLUME_COLOR_CONSTANTS.TEXT_DOWN_COLOR,
                }}
                >
                {getformattedVolume(volumeInfo.volume)}
                </span>
            </div>
            )}
            {
            hoveredTime && xPosition !== null && isBacktestEnable &&(
                <div
                className="absolute top-0 h-full w-[1px] pointer-events-none"
                style={{ left: xPosition, top: 0, bottom: 0, border: '1px solid blue', zIndex: 10 }}
                />
            )
            }
        </div>
    );
};

export default TradingViewChart;
