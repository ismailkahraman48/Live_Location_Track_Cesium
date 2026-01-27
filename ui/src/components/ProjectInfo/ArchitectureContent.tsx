import { useBusData } from "../../context/BusData";
import TechItem from './TechItem';
import ClassCard from './ClassCard';

const ArchitectureContent = () => {
    const { isConnected, reconnect, disconnect } = useBusData();

    return (
        <div className="space-y-12 text-slate-300">

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-blue-400 flex items-center gap-3">
                        <span className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h9.45a3.375 3.375 0 012.7 1.35L20.7 8.55a4.5 4.5 0 011.2 2.7m-20.1 0V19.5a4.5 4.5 0 004.5 4.5h12a4.5 4.5 0 004.5-4.5V11.25" /></svg>
                        </span>
                        Backend Architecture (API)
                    </h2>
                    <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">Python FastAPI</div>
                </div>

                <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 space-y-4">
                    <p className="text-sm leading-relaxed">
                        The backend acts as a high-throughput proxy between IETT public services and clients.
                        It uses an <strong>Asynchronous Event Loop</strong> to manage thousands of bus entities simultaneously.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <TechItem title="FastAPI & Uvicorn" desc="High-performance ASGI server handling concurrent WebSocket connections." />
                        <TechItem title="Data Simulator" desc="Since public data is static, a custom engine moves buses along LineStrings based on schedule speeds." />
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            End-to-End System Data Flow
                        </h3>
                        <div className="bg-black/30 p-4 rounded-xl border border-white/5 overflow-x-auto">
                            <pre className="text-[10px] sm:text-xs leading-relaxed font-mono text-blue-300 whitespace-pre">
                                {`[ IETT Public API ]
       │
       ▼
 ┌──────────────────────┐
 │   iett_parser.py     │  <-- Parse "LINESTRING" & Stops
 └──────────┬───────────┘
            │ (Generates)
            ▼
 ┌──────────────────────┐
 │ routes_data/*.py     │  <-- Static Route Assets (e.g. route_10b.py)
 └──────────┬───────────┘
            │ (Loaded by)
            ▼
 ┌──────────────────────┐
 │  bus_simulator.py    │  <-- Interpolates position based on time (dt)
 └──────────┬───────────┘      Simulates traffic speed & stops
            │
            ▼
 ┌──────────────────────┐
 │  FastAPI WebSocket   │  <-- Broadcasts JSON Payload (2Hz)
 └──────────┬───────────┘      (sleep(2) loop)
            │
       ( ws:// )
            │
            ▼
 ┌──────────────────────┐
 │  useBusTracking.ts   │  <-- React Hook / State Manager
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │    BusLayer.tsx      │  <-- Cesium Integration
 ├──────────────────────┤
 │ - Entity Creation    │
 │ - SampledProperty    │  <-- setInterpolationOptions({ ... })
 │ - Orientation        │
 └──────────────────────┘`}
                            </pre>
                        </div>
                    </div>


                    <div className="mt-4 bg-slate-900 border border-slate-700/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-semibold text-blue-300">WebSocket Broadcast Frequency: <span className="text-white font-mono">2000ms</span></h4>
                            <code className="text-[10px] bg-slate-800 px-2 py-1 rounded text-yellow-300 font-mono">await asyncio.sleep(2)</code>
                        </div>
                        <div className="relative bg-black/50 p-3 rounded border border-white/5">
                            <pre className="text-[10px] text-emerald-400 font-mono leading-relaxed overflow-x-auto">
                                {`{
    "id": "10B-001",
    "routeCode": "10B",
    "routeName": "10B Hattı",
    "position": {
        "longitude": 29.075724,
        "latitude": 40.986912,
        "altitude": 714
    },
    "heading": 59.4,
    "speed": 6.3,
    "timestamp": "2026-01-27T10:45:09.914504+00:00",
    "nextStop": "HAFIZ İMAM SOKAK",
    "status": "IN_SERVICE",
    "progress": 0.5359,
    "color": "#E91E63"
}`}
                            </pre>
                            <div className="absolute top-2 right-2 px-2 py-1 bg-slate-800/80 text-[10px] text-slate-400 rounded border border-white/10">JSON Payload</div>
                        </div>
                    </div>
                </div>


                <div className="bg-slate-900/50 p-5 rounded-xl border border-dashed border-slate-700">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Real-time Simulation Logic
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-400 font-mono">
                        <li className="flex gap-2">
                            <span className="text-blue-500">1.</span>
                            <span>Fetch Route LineStrings (Geometry)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-purple-500">2.</span>
                            <span>Map Stops to 3D Cartesian Coordinates</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">3.</span>
                            <span>Stream Real-time Updates via WebSocket</span>
                        </li>
                    </ul>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex gap-3 items-center">
                        <span className="text-xs text-slate-500">Interactive Test:</span>
                        <button onClick={disconnect} disabled={!isConnected} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded border border-red-500/20 transition-all disabled:opacity-50">Disconnect</button>
                        <button onClick={reconnect} disabled={isConnected} className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs rounded border border-green-500/20 transition-all disabled:opacity-50">Reconnect</button>
                        <span className={`text-[10px] ml-auto uppercase tracking-wider ${isConnected ? 'text-green-500' : 'text-red-500'}`}>{isConnected ? 'LIVE' : 'OFFLINE'}</span>
                    </div>
                </div>
            </section>


            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-purple-400 flex items-center gap-3">
                        <span className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>
                        </span>
                        Frontend Architecture (Web)
                    </h2>
                    <div className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono border border-purple-500/20">React + CesiumJS</div>
                </div>

                <div className="space-y-4">
                    <p className="text-sm leading-relaxed">
                        The frontend is a <strong>Single Page Application (SPA)</strong> that maintains a continuous 3D rendering loop.
                        It synchronizes the Cesium Clock with server timestamps to ensure smooth interpolation.
                    </p>

                    <h3 className="text-sm font-semibold text-white mt-4 border-b border-slate-800 pb-2">Core Cesium Classes & Logic</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <ClassCard
                            name="Viewer"
                            desc="The root Cesium component. Configured with 'SceneMode.SCENE3D' and custom terrain providers. We optimized it by disabling unneeded widgets (Timeline, AnimationController) for a cleaner UI."
                        />
                        <ClassCard
                            name="Entity API"
                            desc="We use Entities instead of Primitives for ease of use. Each bus is an Entity with 'model', 'position', and 'orientation' properties. This allows automatic handling of picking (clicking) and tracking."
                        />
                        <ClassCard
                            name="SampledPositionProperty"
                            desc="CRITICAL FOR SMOOTHNESS. Instead of setting a fixed position, we add time-tagged samples. Cesium automatically interpolates the position between updates, creating fluid movement even if network packets are delayed."
                        />
                        <ClassCard
                            name="JulianDate"
                            desc="Cesium uses Julian Dates for high-precision timing. We convert server ISO8601 timestamps to JulianDate to synchronize the animation clock perfectly with the data stream."
                        />
                        <ClassCard
                            name="HeightReference.CLAMP_TO_GROUND"
                            desc="Ensures buses stick to the 3D terrain (hills, roads) rather than flying in the air or sinking underground."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ArchitectureContent;
