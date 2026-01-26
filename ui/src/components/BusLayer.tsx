import { useEffect, useRef } from "react";
import {
    Cartesian3,
    Color,
    HeightReference,
    HeadingPitchRoll,
    Transforms,
    SampledProperty,
    Quaternion,
    LinearApproximation,
    TimeInterval,
    SampledPositionProperty,
    ExtrapolationType,
    JulianDate,
    Math as CesiumMath
} from "cesium";
import { useCesium } from "../context/Cesium";
import { useBusData } from "../context/BusData";

const BusLayer = () => {
    const { viewer, busEntities } = useCesium();
    const { buses, isConnected } = useBusData();
    const isClockInitialized = useRef(false);

    useEffect(() => {
        if (!viewer || !isConnected || buses.length === 0) return;

        const currentEntities = busEntities.current;
        const activeBusIds = new Set<string>();

        // Clock Synchronization (Only first data)
        if (!isClockInitialized.current) {
            const latestBusTimestamp = buses[0].timestamp;
            const now = JulianDate.fromIso8601(latestBusTimestamp);
            // 5 seconds delay for tracking (buffer for interpolation)
            const delayedTime = JulianDate.addSeconds(now, -5, new JulianDate());

            viewer.clock.currentTime = delayedTime;
            viewer.clock.shouldAnimate = true;
            isClockInitialized.current = true;
        }

        buses.forEach((bus) => {
            activeBusIds.add(bus.id);

            // Julian Date from ISO8601 Timestamp 
            const time = JulianDate.fromIso8601(bus.timestamp);

            // Position to Cartesian3
            const position = Cartesian3.fromDegrees(
                bus.position.longitude,
                bus.position.latitude,
                bus.position.altitude
            );

            // Heading to Radians 
            const headingRadians = CesiumMath.toRadians(bus.heading - 90);
            const hpr = new HeadingPitchRoll(headingRadians, 0, 0);
            const orientation = Transforms.headingPitchRollQuaternion(position, hpr);

            let entity = currentEntities.get(bus.id);

            // New Bus Entity 
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
                        scale: 0.5,
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
            }
            // Update Bus Position and Orientation
            else {
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

        // Remove inactive bus entities
        currentEntities.forEach((entity, id) => {
            if (!activeBusIds.has(id)) {
                viewer.entities.remove(entity);
                currentEntities.delete(id);
            }
        });

    }, [buses, isConnected, viewer, busEntities]);

    return null;
};

export default BusLayer;
