import React, { createContext, useContext, useState, useMemo } from "react";
import { useBusTracking } from "../hooks/useBusTracking";
import type { BusPosition } from "../types/bus";

interface BusDataContextType {
    buses: BusPosition[];
    busesMap: Map<string, BusPosition>;
    isConnected: boolean;
    routeFilter: string;
    setRouteFilter: (code: string) => void;
    busCount: number;
}

const BusDataContext = createContext<BusDataContextType | null>(null);

export const BusDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [routeFilter, setRouteFilter] = useState<string>("");
    const { buses, busesMap, isConnected, busCount } = useBusTracking(routeFilter);

    const value = useMemo(() => ({
        buses,
        busesMap,
        isConnected,
        routeFilter,
        setRouteFilter,
        busCount
    }), [buses, busesMap, isConnected, routeFilter, busCount]);

    return (
        <BusDataContext.Provider value={value}>
            {children}
        </BusDataContext.Provider>
    );
};

export const useBusData = () => {
    const context = useContext(BusDataContext);
    if (!context) {
        throw new Error("useBusData must be used within a BusDataProvider");
    }
    return context;
};
