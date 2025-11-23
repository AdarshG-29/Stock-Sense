import { VOLUME_COLOR_CONSTANTS } from '@/constants/chart';
import { getformattedVolume, getLocalTimeStamp } from '@/utils/helper';
import {
    createChart,
    ColorType,
    CandlestickSeries,
    Time,
    HistogramSeries,
    MouseEventParams,
} from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
    candleData: { time: Time; open: number; high: number; low: number; close: number }[];
    colors?: {
        backgroundColor?: string;
        textColor?: string;
    };
    volumeData: { time: Time; value: number; color?: string }[];
};

const TradingViewChart = (props: Props) => {
    const [volumeInfo, setVolumeInfo] = useState<{ volume: number; color: string | undefined } | null>(null);

    const { candleData, volumeData } = props;

    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = initializeChart(chartContainerRef.current);
        setupCandlestickSeries(chart, candleData);
        const volumeSeries = setupVolumeSeries(chart, volumeData);

        chart.subscribeCrosshairMove((param) => handleCrosshairMove(param, volumeSeries));
        
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
            setVolumeInfo(null);
        };
    }, [candleData, volumeData]);

    const initializeChart = (container: HTMLDivElement) => {
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
        return chart;
    };

    const setupCandlestickSeries = (chart: ReturnType<typeof createChart>, data: Props['candleData']) => {
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
        candlestickSeries.setData(data);
        return candlestickSeries;
    };

    const setupVolumeSeries = (chart: ReturnType<typeof createChart>, data: Props['volumeData']) => {
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
        volumeSeries.setData(data);
        return volumeSeries;
    };

    const handleCrosshairMove = (
        param: MouseEventParams<Time>,
        volumeSeries: ReturnType<typeof setupVolumeSeries>
    ) => {
        if (param.seriesData.size) {
            const volume = param.seriesData.get(volumeSeries);
            if (volume && 'value' in volume && volume.value > 0) {
                setVolumeInfo({ volume: volume.value, color: volume.color });
            }
        }
    };

    return (
        <div ref={chartContainerRef} className="relative w-full">
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
        </div>
    );
};

export default TradingViewChart;
