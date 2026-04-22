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
import { useTranslation } from 'react-i18next';

const BusDashboard = () => {
    const { t, i18n } = useTranslation();
    const { busCount, isConnected, routeFilter, setRouteFilter } = useBusData();

    const toggleLang = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'tr' : 'en');
    };
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
                            color: Color.fromCssColorString('#E2FF54')
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
                                    color: Color.fromCssColorString('#E2FF54'),
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
        <div className="absolute top-0 left-0 w-full md:w-auto md:top-6 md:left-6 z-10 bg-gis-surface p-5 md:rounded-none border-l-4 border-gis-accent text-gis-text shadow-solid md:min-w-[340px] outline outline-1 outline-gis-border">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gis-text tracking-tight uppercase flex items-center gap-2">
                    <span className="w-2 h-2 bg-gis-accent block"></span>
                    {t('dashboard.title')}
                </h2>
                <button 
                  onClick={toggleLang}
                  className="bg-gis-surface-hover border border-gis-border text-gis-accent px-2 py-1 hover:bg-gis-border transition-colors font-mono font-bold uppercase tracking-widest text-[10px] flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  {i18n.language.toUpperCase()}
                </button>
            </div>

            <div className="flex items-center gap-3 mb-5 text-sm">
                <div className="relative">
                    <div className={`w-2 h-2 ${isConnected ? "bg-gis-accent" : "bg-red-500"} relative z-10`} />
                    {isConnected && (
                        <div className="absolute inset-0 bg-gis-accent animate-ping opacity-40" />
                    )}
                </div>
                <span className="text-gis-muted uppercase text-[10px] font-bold tracking-[0.2em]">
                    {isConnected ? t('dashboard.live') : t('dashboard.offline')}
                </span>
                <span className="ml-auto font-mono text-gis-accent bg-gis-accent/10 px-2 py-0.5 text-[11px] border border-gis-accent/20 shadow-[2px_2px_0px_rgba(226,255,84,0.1)]">{busCount} {t('dashboard.vehicles')}</span>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col gap-3">
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
                            placeholder={t('dashboard.placeholder')}
                            className={`w-full bg-gis-surface-hover border-b-2 ${formError ? 'border-red-500' : 'border-gis-border'} px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-gis-accent transition-colors placeholder:text-gis-muted rounded-none`}
                        />

                        {isDropdownOpen && routeCodes.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 max-h-60 overflow-y-auto bg-gis-surface border border-gis-border shadow-solid z-50 custom-scrollbar">
                                {filteredCodes.length > 0 ? (
                                    filteredCodes.map((code) => (
                                        <button
                                            key={code}
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Prevents blur before click
                                                handleSelectRoute(code);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gis-surface-hover hover:text-gis-accent text-sm text-gis-muted font-mono transition-colors border-b border-gis-border last:border-0 flex items-center justify-between group-item"
                                        >
                                            <span>{code}</span>
                                            <svg className="w-3 h-3 opacity-0 group-item-hover:opacity-100 text-gis-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-xs text-gis-muted text-center font-mono uppercase tracking-wider">{t('dashboard.noRoutes')}</div>
                                )}
                            </div>
                        )}

                        {routeFilter && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gis-muted hover:text-gis-text text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button
                        disabled={isLoadingCodes}
                        type="submit"
                        className="bg-gis-accent hover:bg-gis-accent-hover text-black px-4 py-2.5 text-sm font-bold tracking-widest uppercase transition-colors"
                    >
                        {t('dashboard.search')}
                    </button>
                </div>
                {formError && (
                    <div className="text-xs text-red-500 pl-1 font-mono uppercase">{formError}</div>
                )}
            </form>

            {routeFilter && (
                <div className="mt-4 text-xs font-mono text-center text-gis-muted bg-gis-surface-hover py-2 border border-gis-border">
                    {t('dashboard.activeFilter')} <span className="text-gis-accent font-bold pl-1">{routeFilter}</span>
                </div>
            )}
        </div>
    );
};

export default BusDashboard;
