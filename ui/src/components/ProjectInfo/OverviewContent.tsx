import StatCard from './StatCard';
import { useTranslation } from 'react-i18next';

const OverviewContent = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div>
                <h2 className="text-xl font-bold text-gis-text mb-4 border-b border-gis-border pb-3 uppercase tracking-tighter flex items-center gap-2">
                    <span className="w-2 h-2 bg-gis-accent"></span>
                    {t('projectInfo.overview.title')}
                </h2>
                <p className="leading-relaxed text-gis-text/80 font-sans text-sm">
                    {t('projectInfo.overview.p1')}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <StatCard label={t('projectInfo.overview.stats.coreEngine')} value={t('projectInfo.overview.stats.cesium')} />
                <StatCard label={t('projectInfo.overview.stats.realTime')} value={t('projectInfo.overview.stats.websocket')} />
                <StatCard label={t('projectInfo.overview.stats.dataSource')} value={t('projectInfo.overview.stats.iot')} />
                <StatCard label={t('projectInfo.overview.stats.backend')} value={t('projectInfo.overview.stats.fastapi')} />
            </div>

            {/* Future Scalability Note - Rebranded to Industrial */}
            <div className="bg-gis-accent/5 border border-gis-accent/20 p-5 shadow-solid">
                <h3 className="text-gis-accent font-mono font-bold text-xs mb-3 flex items-center gap-2 uppercase tracking-widest">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                    </svg>
                    {t('projectInfo.overview.futureProof')}
                </h3>
                <p className="text-[11px] text-gis-muted leading-relaxed font-sans italic">
                    {t('projectInfo.overview.p2')}
                </p>
            </div>
        </div>
    );

};

export default OverviewContent;
