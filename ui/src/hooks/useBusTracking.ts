import { useCallback, useEffect, useRef, useState } from "react";
import type { BusPosition, BusUpdateMessage } from "../types/bus";
import { getApiUrl } from "../utils/getApiUrl";

export const useBusTracking = (routeCode?: string) => {
    const [buses, setBuses] = useState<Map<string, BusPosition>>(new Map());
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const isMountedRef = useRef(true);


    const connectWebSocketRef = useRef<(() => void) | null>(null);

    const connectWebSocket = useCallback(() => {

        if (wsRef.current) {
            wsRef.current.close();
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        const socketUrl = getApiUrl("/ws/buses");
        const socketUrlWithRoute = routeCode ? `${socketUrl}/${routeCode}` : socketUrl;

        try {
            const ws = new WebSocket(socketUrlWithRoute);
            wsRef.current = ws;

            ws.onopen = () => {
                if (!isMountedRef.current) return;
                setIsConnected(true);
                setError(null);
                reconnectAttemptsRef.current = 0;
            };

            ws.onmessage = (event) => {
                try {
                    const data: BusUpdateMessage = JSON.parse(event.data);
                    if (data.type !== "update" && data.type !== "init") return;

                    const busesMap = new Map<string, BusPosition>();
                    data.buses.forEach((bus) => busesMap.set(bus.id, bus));

                    if (isMountedRef.current) {
                        setBuses(busesMap);
                    }
                } catch (err) {
                    // ignore malformed payloads
                    console.error("BusTracking JSON parse error:", err);
                }
            };

            ws.onerror = () => {
                if (!isMountedRef.current) return;
                setIsConnected(false);
                setError("WebSocket bağlantı hatası");
            };

            ws.onclose = (event) => {
                if (!isMountedRef.current) return;
                setIsConnected(false);

                // Reconnect unless normal close
                if (event.code !== 1000) {
                    reconnectAttemptsRef.current += 1;
                    const attempts = reconnectAttemptsRef.current;

                    if (attempts <= 10) {
                        const delay = Math.min(1000 * Math.pow(2, attempts - 1), 10000);
                        reconnectTimeoutRef.current = window.setTimeout(() => {
                            if (isMountedRef.current && connectWebSocketRef.current) {
                                connectWebSocketRef.current();
                            }
                        }, delay);
                    }
                }
            };
        } catch (err) {
            console.error("WebSocket init error:", err);
            if (isMountedRef.current) {
                setError(
                    `WebSocket oluşturulamadı: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`
                );
            }
        }
    }, [routeCode]);

    useEffect(() => {
        isMountedRef.current = true;
        connectWebSocketRef.current = connectWebSocket;


        const startId = window.setTimeout(() => {
            connectWebSocket();
        }, 0);

        return () => {
            isMountedRef.current = false;
            clearTimeout(startId);

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close(1000, "Component unmounting");
            }
        };
    }, [connectWebSocket]);

    return {
        buses: Array.from(buses.values()),
        busesMap: buses,
        isConnected,
        error,
        busCount: buses.size,
    };
};
