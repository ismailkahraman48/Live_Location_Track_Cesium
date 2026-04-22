
const TechItem = ({ title, desc }: any) => (
    <div className="p-3 bg-gis-surface-hover/30 border border-gis-border relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-gis-accent"></div>
            <div className="text-[11px] font-bold text-gis-text uppercase tracking-tight">{title}</div>
        </div>
        <div className="text-[10px] font-sans text-gis-muted leading-relaxed">{desc}</div>
    </div>
);

export default TechItem;
