import StatCard from './StatCard';
import { useTranslation } from 'react-i18next';

const OverviewContent = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6 text-slate-300">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">{t('projectInfo.overview.title')}</h2>

            <p className="leading-relaxed">
                {t('projectInfo.overview.p1')}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <StatCard label={t('projectInfo.overview.stats.coreEngine')} value={t('projectInfo.overview.stats.cesium')} color="bg-indigo-500/20 text-indigo-400" />
                <StatCard label={t('projectInfo.overview.stats.realTime')} value={t('projectInfo.overview.stats.websocket')} color="bg-emerald-500/20 text-emerald-400" />
                <StatCard label={t('projectInfo.overview.stats.dataSource')} value={t('projectInfo.overview.stats.iot')} color="bg-blue-500/20 text-blue-400" />
                <StatCard label={t('projectInfo.overview.stats.backend')} value={t('projectInfo.overview.stats.fastapi')} color="bg-yellow-500/20 text-yellow-400" />
            </div>

            {/* Future Scalability Note */}
            <div className="mt-6 bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                <h3 className="text-purple-400 font-semibold text-sm mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                    </svg>
                    {t('projectInfo.overview.futureProof')}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                    {t('projectInfo.overview.p2')}
                </p>
            </div>
        </div>
    );
};

export default OverviewContent;
