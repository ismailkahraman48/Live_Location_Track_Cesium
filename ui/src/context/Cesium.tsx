import type { Entity, Viewer } from "cesium";
import { createContext, useState, useContext, useRef, type RefObject } from "react";


interface CesiumContextType {
    viewer: Viewer | null;
    setViewer: (viewer: Viewer | null) => void;
    busEntities: RefObject<Map<string, Entity>>;
}

export const CesiumContext = createContext<CesiumContextType | null>(null);

export const CesiumProvider = ({ children }: { children: React.ReactNode }) => {
    const [viewer, setViewer] = useState<Viewer | null>(null);
    console.log("🚀 ~ CesiumProvider ~ viewer:", viewer)
    const busEntities = useRef<Map<string, Entity>>(new Map());
    return (

        <CesiumContext.Provider value={{ viewer, setViewer, busEntities }}>
            {children}
        </CesiumContext.Provider>
    )
}

export const useCesium = () => {
    const context = useContext(CesiumContext);
    if (!context) {
        throw new Error('useCesium must be used within a CesiumProvider');
    }
    return context;
}