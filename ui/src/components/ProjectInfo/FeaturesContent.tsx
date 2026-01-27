import FeatureItem from './FeatureItem';

const FeaturesContent = () => (
    <div className="space-y-8 text-slate-300">
        <div className="space-y-4">
            <FeatureItem
                title="Interactive Dashboard"
                description="Located at the top-left, the Bus Dashboard allows users to select specific bus routes (e.g., '10B'). Filtering instantly isolates the relevant buses and stops, removing noise from the map."
            />
            <FeatureItem
                title="Entity Selection & Tracking"
                description="Clicking on any bus 3D model opens a detailed Info Card showing live telemetry (Speed, Route, Coordinates). The camera automatically locks onto the selected bus, following it smoothly."
            />
            <FeatureItem
                title="Smart Interpolation"
                description="Discrete GPS updates from buses are converted into smooth movement using Cesium's `SampledPositionProperty`. This prevents 'teleporting' and ensures fluid animation across the map."
            />
            <FeatureItem
                title="3D Model & Clamping"
                description="Each bus is represented by custom GLTF models and clamped precisely to the tracked terrain using `HeightReference.CLAMP_TO_GROUND`."
            />
            <FeatureItem
                title="WebSocket Stream"
                description="Instead of periodic polling (HTTP), an always-open WebSocket tunnel is used to 'Push' data. This reduces server load and significantly improves real-time responsiveness."
            />
        </div>

        {/* Future Roadmap */}
        <div className="pt-6 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
                </svg>
                Future Roadmap
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded border border-white/10">
                    <div className="text-xs font-bold text-yellow-200 mb-1">AI Traffic Prediction</div>
                    <p className="text-[11px] text-slate-400">Machine learning models to estimate ETA delays based on historical speed segments.</p>
                </div>
                <div className="p-3 bg-white/5 rounded border border-white/10">
                    <div className="text-xs font-bold text-pink-200 mb-1">Historical Playback</div>
                    <p className="text-[11px] text-slate-400">Time-slider interface to replay bus movements from previous days (DVR capability).</p>
                </div>
            </div>
        </div>
    </div>
);

export default FeaturesContent;
