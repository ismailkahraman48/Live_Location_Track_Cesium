import React, { useState } from 'react';
import TabButton from './TabButton';
import OverviewContent from './OverviewContent';
import ArchitectureContent from './ArchitectureContent';
import FeaturesContent from './FeaturesContent'
import { useTranslation } from 'react-i18next';

const OverviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="square" strokeLinejoin="miter" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const ArchitectureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="square" strokeLinejoin="miter" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>;
const FeaturesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="square" strokeLinejoin="miter" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;

const ProjectInfo: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'features'>('overview');
    const { t } = useTranslation();

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-6 right-6 z-50 bg-gis-surface text-gis-text px-4 py-3 shadow-solid hover:bg-gis-surface-hover transition-colors flex items-center gap-3 border border-gis-border hover:border-gis-accent group"
            >
                <div className="w-2 h-2 bg-gis-accent" />
                <span className="font-mono font-bold uppercase tracking-widest text-xs">{t('projectInfo.title')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gis-accent group-hover:-rotate-45 transition-transform">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        );
    }

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-gis-surface border border-gis-border w-full max-w-5xl h-full md:h-[85vh] rounded-none shadow-solid overflow-hidden flex flex-col relative">
                {/* Decorative scanner line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gis-accent/50 animate-pulse z-20"></div>

                {/* Header */}
                <div className="p-6 border-b border-gis-border flex justify-between items-center bg-gis-surface-hover/50">
                    <div>
                        <h1 className="text-2xl font-bold text-gis-text uppercase tracking-tight flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-gis-accent"></span>
                            {t('projectInfo.headerTitle')}
                        </h1>
                        <p className="text-gis-muted font-mono tracking-widest text-[10px] mt-2 uppercase flex items-center gap-2">
                            {t('projectInfo.headerSubtitle')}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 border border-gis-border hover:bg-gis-accent hover:text-black transition-all group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform">
                            <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden font-sans">
                    {/* Sidebar / Tabs */}
                    <div className="w-full md:w-64 bg-gis-surface border-b md:border-b-0 md:border-r border-gis-border p-3 md:p-4 flex flex-row md:flex-col gap-3 overflow-x-auto shrink-0 no-scrollbar">
                        <TabButton
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            label={t('projectInfo.tabs.overview')}
                            icon={<OverviewIcon />}
                        />
                        <TabButton
                            active={activeTab === 'architecture'}
                            onClick={() => setActiveTab('architecture')}
                            label={t('projectInfo.tabs.architecture')}
                            icon={<ArchitectureIcon />}
                        />
                        <TabButton
                            active={activeTab === 'features'}
                            onClick={() => setActiveTab('features')}
                            label={t('projectInfo.tabs.features')}
                            icon={<FeaturesIcon />}
                        />

                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px]">
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
