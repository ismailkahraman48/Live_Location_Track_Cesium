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
        <div className="absolute top-6 right-6 w-80 bg-gis-surface border border-gis-border shadow-solid overflow-hidden z-50 animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-gis-border relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gis-text flex items-center gap-3 tracking-tight">
                            <span
                                className="inline-block w-2 h-8"
                                style={{ backgroundColor: bus.color || 'var(--color-gis-accent)' }}
                            ></span>
                            {bus.routeCode}
                        </h2>
                        <p className="text-xs text-gis-muted font-mono uppercase tracking-widest mt-2 ml-5">{bus.routeName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gis-surface-hover text-gis-muted hover:text-gis-text transition-colors border border-transparent hover:border-gis-border"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="px-5 pb-6 pt-5 space-y-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gis-surface-hover p-3 border-l-2 border-gis-border">
                        <span className="text-gis-muted block text-[10px] uppercase tracking-widest font-mono mb-1">VEHICLE ID</span>
                        <span className="font-bold text-gis-text font-mono text-lg">{bus.id}</span>
                    </div>
                    <div className="bg-gis-surface-hover p-3 border-l-2 border-gis-border">
                        <span className="text-gis-muted block text-[10px] uppercase tracking-widest font-mono mb-1">SPEED</span>
                        <span className="font-bold text-gis-text font-mono text-lg">{bus.speed} <span className="text-xs font-normal text-gis-muted">km/h</span></span>
                    </div>
                </div>

                <div className="border border-gis-border p-3 bg-gis-surface-hover/50">
                    <span className="text-gis-muted text-[10px] font-mono uppercase tracking-widest mb-2 block">NEXT STOP</span>
                    <div className="flex items-center gap-3 text-gis-text font-bold">
                        <div className="w-2 h-2 bg-gis-accent"></div>
                        <span className="truncate">{bus.nextStop}</span>
                    </div>
                </div>

                <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-gis-muted uppercase tracking-widest">
                        <span>ROUTE PROGRESS</span>
                        <span className="text-gis-text">{displayPercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gis-surface-hover border border-gis-border overflow-hidden">
                        <div
                            className="h-full transition-all duration-500 ease-out"
                            style={{
                                width: `${progressValue}%`,
                                backgroundColor: bus.color || 'var(--color-gis-accent)'
                            }}
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusInfoCard;
