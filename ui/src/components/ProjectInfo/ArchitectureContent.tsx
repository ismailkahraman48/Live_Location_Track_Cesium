import { useBusData } from "../../context/BusData";
import TechItem from './TechItem';
import { useTranslation } from 'react-i18next';

const ArchitectureContent = () => {
    const { t } = useTranslation();
    const { isConnected, reconnect, disconnect } = useBusData();

    return (
        <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-gis-border pb-4">
                    <h2 className="text-xl font-bold text-gis-text flex items-center gap-4 uppercase tracking-tighter">
                        <div className="p-2 border border-gis-accent bg-gis-accent/10 text-gis-accent shadow-[2px_2px_0px_rgba(226,255,84,0.3)]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="square" strokeLinejoin="miter" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h9.45a3.375 3.375 0 012.7 1.35L20.7 8.55a4.5 4.5 0 011.2 2.7m-20.1 0V19.5a4.5 4.5 0 004.5 4.5h12a4.5 4.5 0 004.5-4.5V11.25" /></svg>
                        </div>
                        {t('projectInfo.architecture.title')}
                    </h2>
                    <div className="px-3 py-1 border border-gis-border bg-gis-surface text-gis-accent text-[10px] font-mono uppercase tracking-widest">{t('projectInfo.architecture.badge')}</div>
                </div>

                <div className="space-y-6">
                    <p className="text-sm font-sans leading-relaxed text-gis-text/70 italic border-l-2 border-gis-border pl-4">
                        {t('projectInfo.architecture.desc')}
                    </p>

                    <div className="bg-gis-surface border border-gis-border shadow-solid overflow-hidden group">
                        <div className="bg-gis-surface-hover p-2 border-b border-gis-border flex items-center justify-between">
                            <h3 className="text-[10px] font-mono font-bold text-gis-text uppercase tracking-widest flex items-center gap-2">
                                <div className="w-2 h-2 bg-gis-accent animate-pulse"></div>
                                {t('projectInfo.architecture.flowTitle')}
                            </h3>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                            </div>
                        </div>
                        <div className="p-6 bg-black/40 overflow-x-auto">
                            <pre className="text-[10px] sm:text-xs leading-relaxed font-mono text-gis-accent/80 whitespace-pre">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="bg-gis-surface border border-gis-border p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-[1px] flex-1 bg-gis-border"></div>
                            <h4 className="text-[10px] font-mono font-bold text-gis-accent uppercase tracking-[0.2em]">{t('projectInfo.architecture.payloadTitle')}</h4>
                            <div className="h-[1px] flex-1 bg-gis-border"></div>
                        </div>
                        <div className="relative bg-black/30 p-4 border border-gis-border">
                            <pre className="text-[10px] text-gis-text/60 font-mono leading-relaxed overflow-x-auto">
                                <code className="text-gis-accent/90">{`{
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
}`}</code>
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="bg-gis-surface border-l-4 border-gis-accent p-6 shadow-solid">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 ${isConnected ? 'bg-gis-accent animate-pulse' : 'bg-red-500'}`}></div>
                            <div>
                                <h3 className="text-xs font-bold text-gis-text uppercase font-mono tracking-widest">
                                    {t('projectInfo.architecture.liveStatus')}
                                </h3>
                                <div className="text-[9px] text-gis-muted font-mono uppercase mt-1">L3 WS Gateway : {isConnected ? 'ACTIVE' : 'IDLE'}</div>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <button
                                onClick={disconnect}
                                disabled={!isConnected}
                                className="flex-1 px-4 py-2 bg-transparent border border-red-500/40 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all disabled:opacity-30"
                            >
                                {t('projectInfo.architecture.disconnect')}
                            </button>
                            <button
                                onClick={reconnect}
                                disabled={isConnected}
                                className="flex-1 px-4 py-2 bg-transparent border border-gis-accent/40 text-gis-accent text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-gis-accent hover:text-black transition-all disabled:opacity-30"
                            >
                                {t('projectInfo.architecture.reconnect')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ArchitectureContent;
