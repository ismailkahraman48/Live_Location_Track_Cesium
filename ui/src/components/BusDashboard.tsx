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
} from "cesium";
import { getApiUrl } from "../utils/getApiUrl";

const BusDashboard = () => {
    const { busCount, isConnected, routeFilter, setRouteFilter } = useBusData();
    const [inputVal, setInputVal] = useState(routeFilter);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [routeCodes, setRouteCodes] = useState<string[]>([]);
    const [isLoadingCodes, setIsLoadingCodes] = useState(false);
    const { viewer } = useCesium();


    const routeDataSourceRef = useRef<DataSource | null>(null);
    const stopsDataSourceRef = useRef<DataSource | null>(null);

    const ROUTES_API_URL = getApiUrl("/routes/codes");

    const [formError, setFormError] = useState<string | null>(null);

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

        const val = inputVal.trim().toUpperCase();

        if (!val) {
            setFormError("Please enter a route code.");
            return;
        }

        if (routeCodes.length > 0 && !routeCodes.includes(val)) {
            setFormError("Invalid route code. Please select from the list.");
            return;
        }

        setFormError(null);
        setRouteFilter(val);
    };

    const handleClear = () => {
        setInputVal("");
        setRouteFilter("");
        setFormError(null);
    };

    const filteredCodes = routeCodes.filter(code =>
        code.toLowerCase().includes(inputVal.toLowerCase())
    );

    const handleSelectRoute = (code: string) => {
        setInputVal(code);
        setRouteFilter(code);
        setFormError(null);
        setIsDropdownOpen(false);
    };

    return (
        <div className="absolute top-0 left-0 w-full md:w-auto md:top-4 md:left-4 z-10 bg-black/80 backdrop-blur-md p-4 md:rounded-xl border-b md:border border-white/10 text-white md:min-w-[300px]">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                IETT Live Tracking
            </h2>

            <div className="flex items-center gap-2 mb-4 text-sm">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-red-500"}`} />
                <span className="text-gray-300">
                    {isConnected ? "Live" : "Offline"}
                </span>
                <span className="ml-auto font-mono text-cyan-400">{busCount} Buses</span>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <div className="relative flex-1 group">
                        <input
                            type="text"
                            value={inputVal}
                            onClick={() => setIsDropdownOpen(true)}
                            onFocus={() => setIsDropdownOpen(true)}
                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                            onChange={(e) => {
                                setInputVal(e.target.value);
                                setFormError(null);
                                setIsDropdownOpen(true);
                            }}
                            placeholder="Route Code (e.g. 500T)"
                            className={`w-full bg-white/5 border ${formError ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors`}
                        />

                        {isDropdownOpen && routeCodes.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-1 max-h-60 overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 custom-scrollbar">
                                {filteredCodes.length > 0 ? (
                                    filteredCodes.map((code) => (
                                        <button
                                            key={code}
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Prevents blur before click
                                                handleSelectRoute(code);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-colors border-b border-white/5 last:border-0 flex items-center justify-between group-item"
                                        >
                                            <span className="font-mono">{code}</span>
                                            <svg className="w-3 h-3 opacity-0 group-item-hover:opacity-100 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-xs text-gray-500 text-center">No routes found</div>
                                )}
                            </div>
                        )}

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
                        disabled={isLoadingCodes}
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Search
                    </button>
                </div>
                {formError && (
                    <div className="text-xs text-red-400 pl-1">{formError}</div>
                )}
            </form>

            {routeFilter && (
                <div className="mt-2 text-xs text-center text-gray-400">
                    Currently tracking only route <span className="text-yellow-400 font-bold">{routeFilter}</span>.
                </div>
            )}
        </div>
    );
};

export default BusDashboard;
