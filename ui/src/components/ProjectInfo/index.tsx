import React, { useState } from 'react';
import TabButton from './TabButton';
import OverviewContent from './OverviewContent';
import ArchitectureContent from './ArchitectureContent';
import FeaturesContent from './FeaturesContent';

const OverviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const ArchitectureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>;
const FeaturesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;

const ProjectInfo: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'features'>('overview');

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-4 right-4 z-50 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg group"
            >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-sm tracking-wide">Project Details</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:rotate-90 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        );
    }

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900/95 border-none md:border border-slate-700 w-full max-w-4xl h-full md:h-[80vh] rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <div>
                        <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                            Istanbul Live Bus Tracking System
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            High-performance 3D visualization powered by CesiumJS & FastAPI
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    {/* Sidebar / Tabs */}
                    <div className="w-full md:w-64 bg-slate-950/30 border-b md:border-b-0 md:border-r border-slate-800 p-2 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto shrink-0 no-scrollbar">
                        <TabButton
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            label="Overview"
                            icon={<OverviewIcon />}
                        />
                        <TabButton
                            active={activeTab === 'architecture'}
                            onClick={() => setActiveTab('architecture')}
                            label="Technical Architecture"
                            icon={<ArchitectureIcon />}
                        />
                        <TabButton
                            active={activeTab === 'features'}
                            onClick={() => setActiveTab('features')}
                            label="3D & Performance"
                            icon={<FeaturesIcon />}
                        />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
                        {activeTab === 'overview' && <OverviewContent />}
                        {activeTab === 'architecture' && <ArchitectureContent />}
                        {activeTab === 'features' && <FeaturesContent />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectInfo;
