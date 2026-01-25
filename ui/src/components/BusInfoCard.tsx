import React from 'react';
import { useBusData } from "../context/BusData";

interface BusInfoCardProps {
    bus: any;
    onClose: () => void;
}

const BusInfoCard: React.FC<BusInfoCardProps> = ({ bus: initialBus, onClose }) => {
    const { buses } = useBusData();

    const bus = buses.find(b => b.id === initialBus?.id) || initialBus;

    if (!bus) return null;

    const rawProgress = typeof bus.progress === 'number' ? bus.progress : parseFloat(bus.progress) || 0;
    const progressValue = rawProgress <= 1 ? rawProgress * 100 : rawProgress;
    const displayPercentage = Math.round(progressValue);

    return (
        <div className="absolute top-4 right-4 w-80 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-right duration-300 border border-white/50">

            <div className="p-4 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundColor: bus.color || '#3b82f6' }}
                />
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span
                                className="inline-block w-3 h-8 rounded-full"
                                style={{ backgroundColor: bus.color || '#3b82f6' }}
                            ></span>
                            {bus.routeCode}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium ml-5">{bus.routeName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="px-5 pb-5 pt-2 space-y-4">

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-400 block text-xs uppercase tracking-wider">Bus ID</span>
                        <span className="font-semibold text-gray-700">{bus.id}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="text-gray-400 block text-xs uppercase tracking-wider">Speed</span>
                        <span className="font-semibold text-gray-700">{bus.speed} km/h</span>
                    </div>
                </div>

                <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1 block">Next Stop</span>
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {bus.nextStop}
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-gray-500">
                        <span>Route Progress</span>
                        <span>{displayPercentage}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                            style={{
                                width: `${progressValue}%`,
                                backgroundColor: bus.color || '#3b82f6'
                            }}
                        >
                            <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite] w-full transform -skew-x-12 translate-x-[-100%]" style={{ content: '""' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusInfoCard;
