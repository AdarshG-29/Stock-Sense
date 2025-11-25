import { VOLUME_COLOR_CONSTANTS } from '@/constants/chart';
import { getformattedVolume } from '@/utils/helper';
import { ScissorsIcon } from 'lucide-react';
import { useTradingView } from './hooks/useTradingView';

const TradingViewChart = () => {
    const { volumeInfo, xPosition, chartContainerRef } = useTradingView();

    const { left = 0, right = 0 } = chartContainerRef.current?.getBoundingClientRect() || {};
    const coveredWidth = right - left - (xPosition || 0) - (window.innerWidth - (right - 20));

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
            {xPosition !== null && (
                <>
                    <div
                        className="absolute top-0 h-full w-[1px] pointer-events-none border border-blue-700 z-10"
                        style={{ left: xPosition }}
                    >
                        <ScissorsIcon className="absolute top-1/2 -translate-x-1/2 text-blue-500" />
                    </div>
                    <div
                        className="absolute top-0 h-full pointer-events-none z-10 bg-black bg-opacity-35"
                        style={{ left: xPosition, width: coveredWidth }}
                    />
                </>
            )}
        </div>
    );
};

export default TradingViewChart;
