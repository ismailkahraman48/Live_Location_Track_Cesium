import { SceneMode, Viewer, WebMercatorProjection, Terrain, Cartesian3, HeadingPitchRoll, Transforms, HeightReference, ShadowMode, Math, createOsmBuildingsAsync } from "cesium"
import { useEffect, useRef } from "react"
import { useCesium } from "../context/Cesium"




const CesiumViewer: React.FC = () => {

    const cesiumContainerRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<Viewer | null>(null)
    const { setViewer } = useCesium();

    const addOSMBuildings = async (cesiumView: Viewer) => {
        const osmBuildings = await createOsmBuildingsAsync()

        cesiumView.scene.primitives.add(osmBuildings)
    }

    useEffect(() => {

        if (cesiumContainerRef.current && !viewerRef.current) {


            try {
                const cesiumView = new Viewer(cesiumContainerRef.current, {
                    sceneMode: SceneMode.SCENE3D,
                    terrain: Terrain.fromWorldTerrain(),
                    baseLayerPicker: false,
                    mapProjection: new WebMercatorProjection(),
                    timeline: true,
                    animation: true,
                    fullscreenButton: false,
                    geocoder: false,
                    homeButton: false,
                    infoBox: false,
                    sceneModePicker: false,
                    selectionIndicator: false,
                    navigationHelpButton: false,
                    navigationInstructionsInitiallyVisible: false,

                    requestRenderMode: true, // Sadece gerektiğinde render al
                    maximumRenderTimeChange: Infinity,
                    shadows: false, // Gölgeleri kapat
                    orderIndependentTranslucency: false, // Saydamlık hesaplamasını kapat
                    contextOptions: {
                        webgl: {
                            powerPreference: "high-performance",
                            antialias: false, // Kenar yumuşatmayı kapat (performans artar)
                        }
                    },
                    msaaSamples: 1, // Multi-sample antialiasing kapat
                });



                const longitude = 28.9784;
                const latitude = 41.0082;
                const height = 0;


                const position = Cartesian3.fromDegrees(longitude, latitude, height);

                const heading = Math.toRadians(90);
                const pitch = 0;
                const roll = 0;
                const hpr = new HeadingPitchRoll(heading, pitch, roll);
                const orientation = Transforms.headingPitchRollQuaternion(position, hpr);

                const busEntity = cesiumView.entities.add({
                    name: "İETT Otobüsü",
                    position: position,
                    orientation: orientation, // Otobüsün burnunun baktığı yön
                    model: {
                        uri: "/otobus.glb", // Public klasöründeki yol
                        scale: 1.0,         // Modelin boyutu (Gerekirse artırın: 10.0 vb.)
                        // minimumPixelSize: 128, // Uzaklaşınca nokta gibi kaybolmasın, en az bu boyutta görünsün
                        // maximumScale: 20000,   // Uzaklaşınca çok aşırı büyümesini engellemek için
                        heightReference: HeightReference.CLAMP_TO_GROUND, // Araziye yapışsın (havada kalmasın)
                        runAnimations: true,   // Modelde tekerlek dönme animasyonu vs. varsa çalıştırır
                        shadows: ShadowMode.ENABLED // Gölge ayarı
                    },

                });
                addOSMBuildings(cesiumView)

                cesiumView.zoomTo(busEntity);




                viewerRef.current = cesiumView;

                setViewer(cesiumView);

            } catch (error) {
                console.error("Error initializing Cesium:", error);
            }
        }

        return () => {
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                viewerRef.current.destroy();
                viewerRef.current = null;
                setViewer(null);
            }
        }

    }, [])

    return (
        <div className="w-full h-full">
            <div
                ref={cesiumContainerRef}
                className="w-full h-full"
            />


        </div>
    )
}

export default CesiumViewer
