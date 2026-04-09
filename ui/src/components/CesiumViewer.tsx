import {
    SceneMode,
    Viewer,
    WebMercatorProjection,
    Terrain,
    createOsmBuildingsAsync,
    Cartesian3,
    Math as CesiumMath,
    ScreenSpaceEventType,
    defined,
    Entity,
    Ion,
} from "cesium"
import { useEffect, useRef, useState } from "react"
import { useCesium } from "../context/Cesium"
import { useBusData } from "../context/BusData"
import BusInfoCard from "./BusInfoCard"
import { useScreenSpaceEvent } from "../hooks/useScreenSpaceEvent"
import BusLayer from "./BusLayer"

const CesiumViewer: React.FC = () => {
    const cesiumContainerRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<Viewer | null>(null)
    const [selectedBus, setSelectedBus] = useState<any>(null);

    const { setViewer, busEntities } = useCesium();
    const { buses } = useBusData();


    Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN || "";


    const addOSMBuildings = async (cesiumView: Viewer) => {
        const osmBuildings = await createOsmBuildingsAsync()
        cesiumView.scene.primitives.add(osmBuildings)
    }


    useEffect(() => {
        if (cesiumContainerRef.current && !viewerRef.current) {
            try {
                const cesiumView = new Viewer(cesiumContainerRef.current, {
                    shouldAnimate: true,
                    sceneMode: SceneMode.SCENE3D,
                    terrain: Terrain.fromWorldTerrain(),
                    baseLayerPicker: false,
                    mapProjection: new WebMercatorProjection(),
                    timeline: false,
                    animation: false,
                    fullscreenButton: false,
                    geocoder: false,
                    homeButton: false,
                    infoBox: false,
                    sceneModePicker: false,
                    selectionIndicator: true,
                    navigationHelpButton: false,
                    navigationInstructionsInitiallyVisible: false,
                    requestRenderMode: false,
                    shadows: false,
                    contextOptions: {
                        webgl: { powerPreference: "high-performance", antialias: false }
                    },
                    msaaSamples: 1,
                });

                cesiumView.clock.shouldAnimate = true;
                cesiumView.clock.multiplier = 1;

                addOSMBuildings(cesiumView)

                cesiumView.camera.setView({
                    destination: Cartesian3.fromDegrees(28.9784, 41.0082, 3000),
                    orientation: {
                        heading: CesiumMath.toRadians(0),
                        pitch: CesiumMath.toRadians(-45),
                        roll: 0.0
                    }
                });

                viewerRef.current = cesiumView;
                setViewer(cesiumView);

            } catch (error) {
                console.error("Error initializing Cesium:", error);
            }
        }

        return () => {
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                viewerRef.current.destroy();
                viewerRef.current = null;
                setViewer(null);
            }
        }
    }, [])


    // BUS INFO CARD EVENT
    useScreenSpaceEvent(
        viewerRef.current,
        ScreenSpaceEventType.LEFT_CLICK,
        (movement: any) => {
            const viewer = viewerRef.current;
            if (!viewer) return;

            const pickedObject = viewer.scene.pick(movement.position);

            if (defined(pickedObject) && pickedObject.id instanceof Entity) {
                const entityId = pickedObject.id.id;

                if (busEntities.current.has(entityId)) {
                    const fullBusData = buses.find(b => b.id === entityId);
                    setSelectedBus(fullBusData || null);
                }
            } else {
                setSelectedBus(null);
            }
        }
    );

    return (
        <div className="w-full h-full relative">
            <div ref={cesiumContainerRef} className="w-full h-full" />
            <BusLayer />
            <BusInfoCard
                bus={selectedBus}
                onClose={() => setSelectedBus(null)}
            />
        </div>
    )
}

export default CesiumViewer;