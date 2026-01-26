import { useState, useEffect, useRef } from "react";
import { useBusData } from "../context/BusData";
import { useCesium } from "../context/Cesium";
import {
    DataSource,
    GeoJsonDataSource,
    PolylineGlowMaterialProperty,
    Color,
    ConstantProperty,
    Cartesian3,
    LabelGraphics,
    PointGraphics,
    DistanceDisplayCondition,
    VerticalOrigin,
    HeadingPitchRange,
    Math as CesiumMath,
    HeightReference,
    Cartographic,
    NearFarScalar,
    LabelStyle,
    JulianDate,
    ConstantPositionProperty,
    Entity,
} from "cesium";
import { getApiUrl } from "../utils/getApiUrl";

const BusDashboard = () => {
    const { busCount, isConnected, routeFilter, setRouteFilter } = useBusData();
    const [inputVal, setInputVal] = useState(routeFilter);
    const [routeCodes, setRouteCodes] = useState<string[]>([]);
    const [isLoadingCodes, setIsLoadingCodes] = useState(false);
    const { viewer } = useCesium();

    // Data Source Refs
    const routeDataSourceRef = useRef<DataSource | null>(null);
    const stopsDataSourceRef = useRef<DataSource | null>(null);

    const ROUTES_API_URL = getApiUrl("/routes/codes");

    useEffect(() => {
        const fetchRouteCodes = async () => {
            try {
                setIsLoadingCodes(true);
                const response = await fetch(ROUTES_API_URL);
                if (response.ok) {
                    const data = await response.json();
                    setRouteCodes(data);
                }
            } catch (error) {
                console.error("Failed to fetch route codes:", error);
            } finally {
                setIsLoadingCodes(false);
            }
        };

        fetchRouteCodes();
    }, []);


    useEffect(() => {
        if (!viewer) return;

        const cleanupDataSources = () => {
            if (routeDataSourceRef.current) {
                viewer.dataSources.remove(routeDataSourceRef.current);
                routeDataSourceRef.current = null;
            }
            if (stopsDataSourceRef.current) {
                viewer.dataSources.remove(stopsDataSourceRef.current);
                stopsDataSourceRef.current = null;
            }
        };

        const loadRouteAndStops = async () => {
            cleanupDataSources();

            if (!routeFilter) return;

            try {
                const [routeRes, stopsRes] = await Promise.all([
                    fetch(getApiUrl(`/routes/${routeFilter}/coordinates`)),
                    fetch(getApiUrl(`/routes/${routeFilter}/stops`))
                ]);

                if (!routeRes.ok) {
                    console.warn(`Rota verisi alınamadı: ${routeFilter}`);
                    return;
                }

                const routeGeoJson = await routeRes.json();
                const routeDs = await GeoJsonDataSource.load(routeGeoJson, {
                    clampToGround: true
                });

                const routeEntities = routeDs.entities.values;
                for (const entity of routeEntities) {
                    if (entity.polyline) {
                        entity.polyline.material = new PolylineGlowMaterialProperty({
                            glowPower: 0.2,
                            color: Color.CYAN
                        });
                        entity.polyline.width = new ConstantProperty(6);
                        entity.polyline.clampToGround = new ConstantProperty(true);
                    }
                }
                await viewer.dataSources.add(routeDs);
                routeDataSourceRef.current = routeDs;


                if (stopsRes.ok) {
                    const stopsGeoJson = await stopsRes.json();
                    const stopsDs = await GeoJsonDataSource.load(stopsGeoJson);


                    const stopEntities = stopsDs.entities.values;

                    for (const entity of stopEntities) {
                        if (entity.position) {
                            const position = entity.position.getValue(JulianDate.now());
                            if (position) {
                                const carto = Cartographic.fromCartesian(position);


                                entity.position = new ConstantPositionProperty(
                                    Cartesian3.fromRadians(carto.longitude, carto.latitude, 50.0)
                                );

                                entity.billboard = undefined;


                                entity.point = new PointGraphics({
                                    color: Color.YELLOW,
                                    pixelSize: 10,
                                    outlineColor: Color.BLACK,
                                    outlineWidth: 2,
                                    heightReference: HeightReference.RELATIVE_TO_GROUND,
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                                    scaleByDistance: new NearFarScalar(1.5e2, 1.5, 1.5e7, 0.5)
                                });

                                if (entity.properties && entity.properties.name) {
                                    entity.label = new LabelGraphics({
                                        text: entity.properties.name.getValue(),
                                        font: "bold 14px sans-serif",
                                        style: LabelStyle.FILL_AND_OUTLINE,
                                        verticalOrigin: VerticalOrigin.BOTTOM,

                                        fillColor: Color.WHITE,
                                        outlineColor: Color.BLACK,
                                        outlineWidth: 3,
                                        heightReference: HeightReference.RELATIVE_TO_GROUND,
                                        distanceDisplayCondition: new DistanceDisplayCondition(0, 5000), // Sadece 5km yaklaşınca göster
                                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                                    });
                                }
                            }
                        }
                    }



                    await viewer.dataSources.add(stopsDs);
                    stopsDataSourceRef.current = stopsDs;
                }

                viewer.flyTo(routeDs, {
                    duration: 1.5,
                    offset: new HeadingPitchRange(0, CesiumMath.toRadians(-45), 0)
                });

            } catch (error) {
                console.error("Rota/Durak yükleme hatası:", error);
            }
        }

        loadRouteAndStops();

        return () => {
            cleanupDataSources();
        };

    }, [routeFilter, viewer]);



    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setRouteFilter(inputVal.trim().toUpperCase());
    };

    const handleClear = () => {
        setInputVal("");
        setRouteFilter("");
    };

    return (
        <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white min-w-[300px]">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                İETT Canlı Takip
            </h2>

            <div className="flex items-center gap-2 mb-4 text-sm">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-red-500"}`} />
                <span className="text-gray-300">
                    {isConnected ? "Bağlantı Aktif" : "Bağlanıyor..."}
                </span>
                <span className="ml-auto font-mono text-cyan-400">{busCount} Otobüs</span>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="Hat Kodu (örn: 500T)"
                        list="route-codes"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <datalist id="route-codes">
                        {routeCodes.map((code) => (
                            <option key={code} value={code} />
                        ))}
                    </datalist>
                    {routeFilter && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    Ara
                </button>
            </form>

            {routeFilter && (
                <div className="mt-2 text-xs text-center text-gray-400">
                    Şu an sadece <span className="text-yellow-400 font-bold">{routeFilter}</span> hattı izleniyor.
                </div>
            )}
        </div>
    );
};

export default BusDashboard;
