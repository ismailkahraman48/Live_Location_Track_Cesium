
const FeatureItem = ({ title, description }: { title: string, description: string }) => (
    <div className="bg-gis-surface/50 p-5 border border-gis-border hover:border-gis-accent transition-all group shadow-solid">
        <h4 className="text-gis-accent font-bold mb-3 uppercase tracking-tighter text-base flex items-center gap-2">
            <span className="w-4 h-[2px] bg-gis-accent opacity-50 group-hover:opacity-100"></span>
            {title}
        </h4>
        <p className="text-sm text-gis-text/80 leading-relaxed font-sans">{description}</p>
    </div>
);

export default FeatureItem;
