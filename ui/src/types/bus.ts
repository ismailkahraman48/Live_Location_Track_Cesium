export interface BusPosition {
    id: string;
    routeCode: string;
    routeName: string;
    position: {
        longitude: number;
        latitude: number;
        altitude: number;
    };
    heading: number; // 0-360 degrees
    speed: number; // km/h
    timestamp: string;
    nextStop: string | null;
    status: 'IN_SERVICE' | 'OUT_OF_SERVICE' | 'AT_STOP' | 'DELAYED';
    progress: number; // 0-1
    color?: string;
}

export interface BusUpdateMessage {
    type: 'init' | 'update';
    buses: BusPosition[];
    timestamp: string;
    count: number;
    routeCode?: string;
}
