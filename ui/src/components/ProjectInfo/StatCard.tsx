
const StatCard = ({ label, value, color }: any) => (
    <div className={`p-4 rounded-xl border border-white/5 ${color} flex flex-col items-center justify-center text-center`}>
        <span className="text-2xl font-bold block mb-1">{value}</span>
        <span className="text-xs opacity-80 uppercase tracking-widest">{label}</span>
    </div>
);

export default StatCard;
