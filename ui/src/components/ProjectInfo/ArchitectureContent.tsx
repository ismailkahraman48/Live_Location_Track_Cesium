import { useBusData } from "../../context/BusData";
import TechItem from './TechItem';
import { useTranslation } from 'react-i18next';

const ArchitectureContent = () => {
    const { t } = useTranslation();
    const { isConnected, reconnect, disconnect } = useBusData();

    return (
        <div className="space-y-12 text-slate-300">

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-blue-400 flex items-center gap-3">
                        <span className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h9.45a3.375 3.375 0 012.7 1.35L20.7 8.55a4.5 4.5 0 011.2 2.7m-20.1 0V19.5a4.5 4.5 0 004.5 4.5h12a4.5 4.5 0 004.5-4.5V11.25" /></svg>
                        </span>
                        {t('projectInfo.architecture.title')}
                    </h2>
                    <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">{t('projectInfo.architecture.badge')}</div>
                </div>

                <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 space-y-4">
                    <p className="text-sm leading-relaxed">
                        {t('projectInfo.architecture.desc')}
                    </p>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            {t('projectInfo.architecture.flowTitle')}
                        </h3>
                        <div className="bg-black/30 p-4 rounded-xl border border-white/5 overflow-x-auto">
                            <pre className="text-[10px] sm:text-xs leading-relaxed font-mono text-blue-300 whitespace-pre">
                                {`[ External Data Sources ]
       │
       ▼
 ┌─────────────────────────┐
 │  1. Data Ingestion Layer│  <-- Normalizes Custom IETT Data
 │  (Parser & Validator)   │      Parses: JSON with WKT "LINESTRING"
 └──────────┬──────────────┘
            ▼
 ┌─────────────────────────┐
 │  2. Simulation Engine   │  <-- Digital Twin Core
 │  (Physics & Timing)     │      Calculates: Position(t), Speed, Heading
 └──────────┬──────────────┘      "Moves" buses along paths in real-time
            ▼
 ┌─────────────────────────┐s
 │  3. Distribution Layer  │  <-- WebSocket Gateway
 │  (Event Broadcaster)    │      Push Model: Sends Delta Updates (2Hz)
 └──────────┬──────────────┘      Optimized JSON payloads
            │
       ( Network )
            │
            ▼
 ┌─────────────────────────┐
 │  4. Client State Layer  │  <-- Buffer & Reconciliation
 │  (React Context)        │      Handles: Reconnection, Filtering, Caching
 └──────────┬──────────────┘
            ▼
 ┌─────────────────────────┐
 │  5. Visualization Layer │  <-- 3D Rendering Engine
 │  (CesiumJS / WebGL)     │      Interpolates frames (60fps)
 └─────────────────────────┘      Clamps to 3D Terrain`}
                            </pre>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <TechItem
                            title={t('projectInfo.architecture.l1Title')}
                            desc={t('projectInfo.architecture.l1Desc')}
                        />
                        <TechItem
                            title={t('projectInfo.architecture.l2Title')}
                            desc={t('projectInfo.architecture.l2Desc')}
                        />
                        <TechItem
                            title={t('projectInfo.architecture.l3Title')}
                            desc={t('projectInfo.architecture.l3Desc')}
                        />
                        <TechItem
                            title={t('projectInfo.architecture.l5Title')}
                            desc={t('projectInfo.architecture.l5Desc')}
                        />
                    </div>

                    <div className="mt-4 bg-slate-900 border border-slate-700/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-semibold text-blue-300">{t('projectInfo.architecture.payloadTitle')}</h4>
                        </div>
                        <div className="relative bg-black/50 p-3 rounded border border-white/5">
                            <pre className="text-[10px] text-emerald-400 font-mono leading-relaxed overflow-x-auto">
                                {`{
    "id": "10B-001",           // Unique Entity ID
    "routeCode": "10B",        // Grouping Key
    "position": {              // 3D Cartesian Coordinates
        "longitude": 29.075,
        "latitude": 40.986,
        "altitude": 0          // Clamped by Client
    },
    "heading": 59.4,           // Orientation
    "speed": 6.3,              // For vector extrapolation
    "timestamp": "ISO8601"     // Sync Key
}`}
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-5 rounded-xl border border-dashed border-slate-700">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {t('projectInfo.architecture.liveStatus')}
                        </h3>
                        <div className="flex gap-3">
                            <button onClick={disconnect} disabled={!isConnected} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded border border-red-500/20 transition-all disabled:opacity-50">{t('projectInfo.architecture.disconnect')}</button>
                            <button onClick={reconnect} disabled={isConnected} className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs rounded border border-green-500/20 transition-all disabled:opacity-50">{t('projectInfo.architecture.reconnect')}</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ArchitectureContent;
