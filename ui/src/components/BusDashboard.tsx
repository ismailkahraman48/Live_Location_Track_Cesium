import { useState, useEffect, useRef } from "react";
import { useBusData } from "../context/BusData";
import { useCesium } from "../context/Cesium";
import {
    DataSource,
    GeoJsonDataSource,
    PolylineGlowMaterialProperty,
    Color,
    ConstantProperty,
} from "cesium";

const BusDashboard = () => {
    const { busCount, isConnected, routeFilter, setRouteFilter } = useBusData();
    const [inputVal, setInputVal] = useState(routeFilter);
    const [routeCodes, setRouteCodes] = useState<string[]>([]);
    const [isLoadingCodes, setIsLoadingCodes] = useState(false);
    const { viewer } = useCesium();
    const routeDataSourceRef = useRef<DataSource | null>(null);

    const ROUTES_API_URL = "http://localhost:8080/routes/codes";

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

        const loadRoute = async () => {

            if (routeDataSourceRef.current) {
                viewer.dataSources.remove(routeDataSourceRef.current);
                routeDataSourceRef.current = null;
            }
            if (!routeFilter) return;

            try {
                const response = await fetch(`http://localhost:8080/routes/${routeFilter}/coordinates`);
                if (!response.ok) {
                    console.warn("Rota verisi bulunamadı:", routeFilter);
                    return;
                };

                const geoJson = await response.json();

                const dataSource = await GeoJsonDataSource.load(geoJson, {
                    clampToGround: true
                });
                const entities = dataSource.entities.values;
                for (const entity of entities) {
                    if (entity.polyline) {
                        entity.polyline.material = new PolylineGlowMaterialProperty({
                            glowPower: 0.2,
                            color: Color.CYAN
                        });
                        entity.polyline.width = new ConstantProperty(6);
                        entity.polyline.clampToGround = new ConstantProperty(true);
                    }
                }

                await viewer.dataSources.add(dataSource);
                routeDataSourceRef.current = dataSource;

            } catch (error) {
                console.error("Rota yükleme hatası:", error);
            }
        }

        loadRoute();

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
