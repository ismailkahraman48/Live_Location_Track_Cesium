import React, { createContext, useContext, useState, useMemo } from "react";
import { useBusTracking } from "../hooks/useBusTracking";
import type { BusPosition } from "../types/bus";

interface BusDataContextType {
    buses: BusPosition[];
    busesMap: Map<string, BusPosition>;
    isConnected: boolean;
    error: string | null;
    routeFilter: string;
    setRouteFilter: (code: string) => void;
    busCount: number;
    reconnect: () => void;
    disconnect: () => void;
}

const BusDataContext = createContext<BusDataContextType | null>(null);

export const BusDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [routeFilter, setRouteFilter] = useState<string>("");
    const { buses, busesMap, isConnected, busCount, error, reconnect, disconnect } = useBusTracking(routeFilter);

    const value = useMemo(() => ({
        buses,
        busesMap,
        isConnected,
        routeFilter,
        setRouteFilter,
        busCount,
        error,
        reconnect,
        disconnect
    }), [buses, busesMap, isConnected, routeFilter, busCount, error, reconnect, disconnect]);

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
