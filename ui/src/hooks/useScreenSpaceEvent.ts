import { useEffect } from 'react';
import { ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer } from 'cesium';

export const useScreenSpaceEvent = (
    viewer: Viewer | null,
    type: ScreenSpaceEventType,
    action: (movement: any) => void,
    modifier?: number
) => {
    useEffect(() => {
        if (!viewer) return;

        const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

        handler.setInputAction(action, type, modifier);

        return () => {
            if (!handler.isDestroyed()) {
                handler.destroy();
            }
        };
    }, [viewer, type, action, modifier]);
};
