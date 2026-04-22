
const StatCard = ({ label, value }: any) => (
    <div className="p-4 border border-gis-border bg-gis-surface-hover/20 relative group hover:border-gis-accent transition-colors">
        <div className="absolute top-0 right-0 w-1 h-1 bg-gis-accent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-xl font-bold font-mono text-gis-accent block mb-1">{value}</span>
        <span className="text-[10px] text-gis-muted uppercase tracking-widest font-mono">{label}</span>
    </div>
);

export default StatCard;
