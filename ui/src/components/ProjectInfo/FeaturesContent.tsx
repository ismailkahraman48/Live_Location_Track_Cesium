import FeatureItem from './FeatureItem';
import { useTranslation } from 'react-i18next';

const FeaturesContent = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-10 animate-in slide-in-from-right-12 duration-700">
            <div className="grid grid-cols-1 gap-6">
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
            <div className="pt-8 border-t border-gis-border">
                <h3 className="text-sm font-bold text-gis-text mb-6 flex items-center gap-3 uppercase font-mono tracking-widest">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gis-accent">
                        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
                    </svg>
                    {t('projectInfo.features.roadmap')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gis-surface border border-gis-border relative overflow-hidden shadow-solid group hover:border-gis-accent transition-colors">
                        <div className="text-[11px] font-bold text-gis-accent mb-2 uppercase font-mono">{t('projectInfo.features.r1Title')}</div>
                        <p className="text-[10px] text-gis-muted font-sans leading-relaxed italic">{t('projectInfo.features.r1Desc')}</p>
                    </div>
                    <div className="p-4 bg-gis-surface border border-gis-border relative overflow-hidden shadow-solid group hover:border-gis-accent transition-colors">
                        <div className="text-[11px] font-bold text-gis-accent mb-2 uppercase font-mono">{t('projectInfo.features.r2Title')}</div>
                        <p className="text-[10px] text-gis-muted font-sans leading-relaxed italic">{t('projectInfo.features.r2Desc')}</p>
                    </div>
                    <div className="p-4 bg-gis-surface border border-gis-border relative overflow-hidden shadow-solid group hover:border-gis-accent transition-colors md:col-span-2">
                        <div className="text-[11px] font-bold text-gis-accent mb-2 uppercase font-mono">{t('projectInfo.features.r3Title')}</div>
                        <p className="text-[10px] text-gis-muted font-sans leading-relaxed italic">
                            {t('projectInfo.features.r3Desc')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default FeaturesContent;
