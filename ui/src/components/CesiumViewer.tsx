import {
    SceneMode,
    Viewer,
    WebMercatorProjection,
    Terrain,
    createOsmBuildingsAsync,
    Cartesian3,
    Math as CesiumMath,
    JulianDate,
    SampledPositionProperty,
    ExtrapolationType,
    Color,
    HeightReference,
    HeadingPitchRoll,
    Transforms,
    SampledProperty,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    defined,
    LinearApproximation,
    Quaternion,
    TimeInterval,
} from "cesium"
import { useEffect, useRef, useState } from "react"
import { useCesium } from "../context/Cesium"
import { useBusData } from "../context/BusData"
import ClientLocator from "./ClientLocator"
import BusInfoCard from "./BusInfoCard"

const CesiumViewer: React.FC = () => {
    const cesiumContainerRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<Viewer | null>(null)
    const [selectedBus, setSelectedBus] = useState<any>(null);

    const isClockInitialized = useRef(false);

    const { setViewer, busEntities } = useCesium();

    const { buses, isConnected } = useBusData();


    const busesRef = useRef(buses);
    useEffect(() => {
        busesRef.current = buses;
    }, [buses]);

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

                // Handle clicks for checking/unchecking buses
                // defined once on mount, uses ref to access latest state
                const handler = new ScreenSpaceEventHandler(cesiumView.scene.canvas);
                handler.setInputAction((movement: any) => {
                    const pickedObject = cesiumView.scene.pick(movement.position);

                    if (defined(pickedObject) && pickedObject.id) {
                        const entityId = pickedObject.id.id;
                        // Use ref to get latest buses without re-running effect
                        const busData = busesRef.current.find(b => b.id === entityId);

                        if (busData) {
                            setSelectedBus(busData);
                        }
                    } else {
                        setSelectedBus(null);
                    }
                }, ScreenSpaceEventType.LEFT_CLICK);

                setViewer(cesiumView);

            } catch (error) {
                console.error("Error initializing Cesium:", error);
            }
        }

        return () => {
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                // Destroy handler if possible, though destroying viewer does it too usually.
                // But good practice to be explicit if we treated it separately.
                // Since handler is attached to scene.canvas, destroying viewer is enough.
                viewerRef.current.destroy();
                viewerRef.current = null;
                setViewer(null);
            }
        }
    }, [])




    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || !isConnected || buses.length === 0) return;

        const currentEntities = busEntities.current;
        const activeBusIds = new Set<string>();


        if (!isClockInitialized.current) {
            const latestBusTimestamp = buses[0].timestamp;
            const now = JulianDate.fromIso8601(latestBusTimestamp);
            const delayedTime = JulianDate.addSeconds(now, -5, new JulianDate());

            viewer.clock.currentTime = delayedTime;
            viewer.clock.shouldAnimate = true;
            isClockInitialized.current = true;
        }

        buses.forEach((bus) => {
            activeBusIds.add(bus.id);

            const time = JulianDate.fromIso8601(bus.timestamp);

            const position = Cartesian3.fromDegrees(
                bus.position.longitude,
                bus.position.latitude,
                bus.position.altitude
            );

            const headingRadians = CesiumMath.toRadians(bus.heading - 90);
            const hpr = new HeadingPitchRoll(headingRadians, 0, 0);
            const orientation = Transforms.headingPitchRollQuaternion(position, hpr);

            let entity = currentEntities.get(bus.id);

            if (!entity) {

                const positionProperty = new SampledPositionProperty();
                positionProperty.forwardExtrapolationType = ExtrapolationType.HOLD;

                positionProperty.setInterpolationOptions({
                    interpolationDegree: 1,
                    interpolationAlgorithm: LinearApproximation
                });
                positionProperty.addSample(time, position);

                const orientationProperty = new SampledProperty(Quaternion);
                orientationProperty.forwardExtrapolationType = ExtrapolationType.HOLD;
                orientationProperty.addSample(time, orientation);

                const routeColor = bus.color || "#FFFFFF";

                entity = viewer.entities.add({
                    id: bus.id,
                    position: positionProperty,
                    orientation: orientationProperty,
                    name: `Bus ${bus.id}`,
                    model: {
                        uri: "/bus.glb",
                        scale: 0.2,
                        minimumPixelSize: 64,
                        heightReference: HeightReference.CLAMP_TO_GROUND,
                        color: Color.fromCssColorString(routeColor).withAlpha(1)
                    },
                    label: {
                        text: `${bus.routeCode}`,
                        font: "14px sans-serif",
                        style: 1,
                        fillColor: Color.WHITE,
                        outlineColor: Color.BLACK,
                        outlineWidth: 2,
                        verticalOrigin: 1,
                        pixelOffset: new Cartesian3(0, -20, 0),
                        heightReference: HeightReference.CLAMP_TO_GROUND,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    }

                });

                currentEntities.set(bus.id, entity);
            } else {
                const removeTime = JulianDate.addSeconds(time, -60, new JulianDate());
                const removeInterval = new TimeInterval({
                    start: new JulianDate(0, 0),
                    stop: removeTime
                });

                const positionProp = entity.position as SampledPositionProperty;
                positionProp.addSample(time, position);
                positionProp.removeSamples(removeInterval);

                const orientationProp = entity.orientation as SampledProperty;
                orientationProp.addSample(time, orientation);
                orientationProp.removeSamples(removeInterval);
            }
        });

        // Temizlik
        currentEntities.forEach((entity, id) => {
            if (!activeBusIds.has(id)) {
                viewer.entities.remove(entity);
                currentEntities.delete(id);
            }
        });

    }, [buses, isConnected]);





    // // Helper for focusing camera
    // const handleFocus = (bus: any) => {
    //     if (!viewerRef.current || !bus) return;

    //     const entity = busEntities.current.get(bus.id);
    //     if (entity) {
    //         viewerRef.current.flyTo(entity, {
    //             offset: new HeadingPitchRange(0, CesiumMath.toRadians(-45), 500)
    //         });
    //     }
    // };

    return (
        <div className="w-full h-full relative">
            <div ref={cesiumContainerRef} className="w-full h-full" />
            <ClientLocator />
            <BusInfoCard
                bus={selectedBus}
                onClose={() => setSelectedBus(null)}
            // onFocus={handleFocus}
            />
        </div>
    )
}

export default CesiumViewer;