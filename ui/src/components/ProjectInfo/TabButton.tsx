
const TabButton = ({ active, onClick, label, icon }: any) => (
    <button
        onClick={onClick}
        className={`w-auto md:w-full flex items-center gap-4 px-4 py-3 transition-all text-left whitespace-nowrap border-b-2 md:border-b-0 md:border-l-2 ${active
            ? 'bg-gis-accent/10 text-gis-accent border-gis-accent font-bold'
            : 'text-gis-muted border-transparent hover:bg-gis-surface-hover hover:text-gis-text'
            }`}
    >
        <div className={`p-1.5 border ${active ? 'border-gis-accent text-gis-accent' : 'border-gis-border text-gis-muted'}`}>
            {icon}
        </div>
        <span className="font-mono uppercase tracking-widest text-[11px]">{label}</span>
    </button>
);

export default TabButton;
