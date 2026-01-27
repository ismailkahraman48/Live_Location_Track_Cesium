
const TechItem = ({ title, desc }: any) => (
    <div className="p-3 bg-slate-900 rounded border border-slate-800">
        <div className="text-xs font-bold text-white mb-1">{title}</div>
        <div className="text-[11px] text-slate-400 leading-tight">{desc}</div>
    </div>
);

export default TechItem;
