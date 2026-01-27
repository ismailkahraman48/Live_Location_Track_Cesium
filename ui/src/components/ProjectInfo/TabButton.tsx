
const TabButton = ({ active, onClick, label, icon }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${active
            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
    >
        {icon}
        <span className="font-medium text-sm">{label}</span>
    </button>
);

export default TabButton;
