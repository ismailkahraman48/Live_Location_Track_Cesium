

const ClassCard = ({ name, desc }: any) => (
    <div className="group p-4 bg-slate-800/20 hover:bg-slate-800/40 border border-slate-700/50 hover:border-purple-500/30 rounded-lg transition-all">
        <code className="text-sm font-bold text-purple-300 block mb-2 font-mono group-hover:text-purple-200">{name}</code>
        <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300">{desc}</p>
    </div>
);

export default ClassCard;
