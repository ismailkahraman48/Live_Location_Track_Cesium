
const FeatureItem = ({ title, description }: { title: string, description: string }) => (
    <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
        <h4 className="text-emerald-400 font-semibold mb-2">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
    </div>
);

export default FeatureItem;
