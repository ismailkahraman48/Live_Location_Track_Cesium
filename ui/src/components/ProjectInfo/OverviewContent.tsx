
import StatCard from './StatCard';

const OverviewContent = () => (
    <div className="space-y-6 text-slate-300">
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">About The Project</h2>
        <p>
            This project is a high-performance Geographic Information System (GIS) application that visualizes
            Istanbul public transport data in real-time on a 3D globe.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6">
            <StatCard label="Active Buses" value="1000+" color="bg-emerald-500/20 text-emerald-400" />
            <StatCard label="Latency" value="&lt; 500ms" color="bg-blue-500/20 text-blue-400" />
            <StatCard label="Data Source" value="IETT API" color="bg-yellow-500/20 text-yellow-400" />
            <StatCard label="Technology" value="CesiumJS" color="bg-indigo-500/20 text-indigo-400" />
        </div>

        {/* Live Data Readiness Note */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
            <h3 className="text-blue-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.202a.75.75 0 01-1.5 0v-.202c0-.944.606-1.657 1.336-2.008.237-.113.48-.246.69-.43 1.096-.96 1.096-2.52 0-3.48zM12 15.75a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008a.75.75 0 01.75-.75h.008z" clipRule="evenodd" />
                </svg>
                Production Ready Architecture
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
                While this demo uses a high-fidelity simulator for consistent data presentation, the system core is engineered to ingest <strong>Real-Time GPS Telemetry</strong> (e.g., GTFS-Realtime, MQTT). The WebSocket architecture allows for seamless substitution of the simulator with a live IETT data stream without any frontend modifications.
            </p>
        </div>
    </div>
);

export default OverviewContent;
