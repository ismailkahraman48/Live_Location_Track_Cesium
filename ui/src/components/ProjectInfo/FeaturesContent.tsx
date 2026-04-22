import FeatureItem from './FeatureItem';
import { useTranslation } from 'react-i18next';

const FeaturesContent = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-8 text-slate-300">
            <div className="space-y-4">
                <FeatureItem
                    title={t('projectInfo.features.f1Title')}
                    description={t('projectInfo.features.f1Desc')}
                />
                <FeatureItem
                    title={t('projectInfo.features.f2Title')}
                    description={t('projectInfo.features.f2Desc')}
                />
                <FeatureItem
                    title={t('projectInfo.features.f3Title')}
                    description={t('projectInfo.features.f3Desc')}
                />
                <FeatureItem
                    title={t('projectInfo.features.f4Title')}
                    description={t('projectInfo.features.f4Desc')}
                />
                <FeatureItem
                    title={t('projectInfo.features.f5Title')}
                    description={t('projectInfo.features.f5Desc')}
                />
            </div>

            {/* Future Roadmap */}
            <div className="pt-6 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
                        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
                    </svg>
                    {t('projectInfo.features.roadmap')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded border border-white/10">
                        <div className="text-xs font-bold text-yellow-200 mb-1">{t('projectInfo.features.r1Title')}</div>
                        <p className="text-[11px] text-slate-400">{t('projectInfo.features.r1Desc')}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded border border-white/10">
                        <div className="text-xs font-bold text-pink-200 mb-1">{t('projectInfo.features.r2Title')}</div>
                        <p className="text-[11px] text-slate-400">{t('projectInfo.features.r2Desc')}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded border border-white/10 md:col-span-2">
                        <div className="text-xs font-bold text-cyan-200 mb-1">{t('projectInfo.features.r3Title')}</div>
                        <p className="text-[11px] text-slate-400">
                            {t('projectInfo.features.r3Desc')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturesContent;
