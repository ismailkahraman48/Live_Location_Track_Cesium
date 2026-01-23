import { Cartesian3, Color, HeightReference } from "cesium";
import { useCesium } from "../context/Cesium";





const ClientLocator = () => {

    const { viewer } = useCesium();

    const handleShowUserLocation = () => {
        if (!viewer) return;

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    viewer.entities.add({
                        position: Cartesian3.fromDegrees(longitude, latitude, 10),
                        point: {
                            pixelSize: 15,
                            color: Color.RED,
                            outlineColor: Color.WHITE,
                            outlineWidth: 3,
                            heightReference: HeightReference.RELATIVE_TO_TERRAIN
                        },
                        label: {
                            text: "Siz Buradasınız",
                            font: "14px sans-serif",
                            style: 1, // FILL_AND_OUTLINE
                            fillColor: Color.WHITE,
                            outlineColor: Color.BLACK,
                            outlineWidth: 2,
                            horizontalOrigin: 0, // CENTER
                            verticalOrigin: 1,   // BOTTOM
                            pixelOffset: new Cartesian3(0, -20, 0),
                            heightReference: HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });

                    viewer.camera.flyTo({
                        destination: Cartesian3.fromDegrees(longitude, latitude, 2000), // 2000m yükseklik
                        duration: 2
                    });
                },
                (error) => {
                    console.error("Konum hatası:", error);
                    alert("Konum bilgisi alınamadı. Lütfen izinleri kontrol edin.");
                },
                { enableHighAccuracy: true }
            );
        } else {
            alert("Tarayıcınız konum özelliğini desteklemiyor.");
        }
    };



    return (
        <button
            onClick={handleShowUserLocation}
            className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded shadow-lg hover:bg-gray-100 transition-colors z-10 flex items-center gap-2 font-medium"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Konumumu Bul
        </button>
    )
}

export default ClientLocator;
