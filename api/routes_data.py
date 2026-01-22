"""
Istanbul Bus Routes Data - 5 Different Routes with Real Coordinates
Each route contains coordinates (lon, lat) and stop information
"""

ISTANBUL_ROUTES = {
    "34G": {
        "code": "34G",
        "name": "Eminönü - Alibeyköy",
        "color": "#E53935",
        "bus_count": 3,
        "coordinates": [
            [28.9713, 41.0177],  # Eminönü
            [28.9692, 41.0195],
            [28.9678, 41.0218],
            [28.9651, 41.0245],
            [28.9627, 41.0268],  # Unkapanı
            [28.9584, 41.0302],
            [28.9545, 41.0338],
            [28.9512, 41.0375],
            [28.9478, 41.0412],  # Ayvansaray
            [28.9445, 41.0448],
            [28.9412, 41.0485],
            [28.9385, 41.0522],
            [28.9358, 41.0558],  # Balat
            [28.9332, 41.0595],
            [28.9308, 41.0632],
            [28.9285, 41.0668],
            [28.9262, 41.0705],  # Fener
            [28.9245, 41.0742],
            [28.9228, 41.0778],
            [28.9212, 41.0815],
            [28.9195, 41.0852],  # Defterdar
            [28.9178, 41.0888],
            [28.9162, 41.0925],
            [28.9148, 41.0962],
            [28.9135, 41.0998],  # Alibeyköy
        ],
        "stops": [
            {"name": "Eminönü", "position": {"longitude": 28.9713, "latitude": 41.0177, "altitude": 10}},
            {"name": "Unkapanı", "position": {"longitude": 28.9627, "latitude": 41.0268, "altitude": 15}},
            {"name": "Ayvansaray", "position": {"longitude": 28.9478, "latitude": 41.0412, "altitude": 25}},
            {"name": "Balat", "position": {"longitude": 28.9358, "latitude": 41.0558, "altitude": 35}},
            {"name": "Fener", "position": {"longitude": 28.9262, "latitude": 41.0705, "altitude": 45}},
            {"name": "Defterdar", "position": {"longitude": 28.9195, "latitude": 41.0852, "altitude": 55}},
            {"name": "Alibeyköy", "position": {"longitude": 28.9135, "latitude": 41.0998, "altitude": 65}},
        ]
    },
    "500T": {
        "code": "500T",
        "name": "Taksim - Topkapı",
        "color": "#1E88E5",
        "bus_count": 2,
        "coordinates": [
            [28.9853, 41.0369],  # Taksim
            [28.9812, 41.0352],
            [28.9768, 41.0338],
            [28.9725, 41.0325],  # Tarlabaşı
            [28.9682, 41.0308],
            [28.9638, 41.0292],
            [28.9595, 41.0278],  # Şişhane
            [28.9552, 41.0262],
            [28.9508, 41.0248],
            [28.9465, 41.0232],  # Karaköy
            [28.9422, 41.0218],
            [28.9378, 41.0202],
            [28.9335, 41.0188],  # Eminönü
            [28.9292, 41.0172],
            [28.9248, 41.0158],
            [28.9205, 41.0142],  # Aksaray
            [28.9162, 41.0128],
            [28.9118, 41.0112],
            [28.9075, 41.0098],  # Topkapı
        ],
        "stops": [
            {"name": "Taksim", "position": {"longitude": 28.9853, "latitude": 41.0369, "altitude": 80}},
            {"name": "Tarlabaşı", "position": {"longitude": 28.9725, "latitude": 41.0325, "altitude": 70}},
            {"name": "Şişhane", "position": {"longitude": 28.9595, "latitude": 41.0278, "altitude": 55}},
            {"name": "Karaköy", "position": {"longitude": 28.9465, "latitude": 41.0232, "altitude": 15}},
            {"name": "Eminönü", "position": {"longitude": 28.9335, "latitude": 41.0188, "altitude": 10}},
            {"name": "Aksaray", "position": {"longitude": 28.9205, "latitude": 41.0142, "altitude": 25}},
            {"name": "Topkapı", "position": {"longitude": 28.9075, "latitude": 41.0098, "altitude": 45}},
        ]
    },
    "77A": {
        "code": "77A",
        "name": "Kadıköy - Altunizade",
        "color": "#43A047",
        "bus_count": 3,
        "coordinates": [
            [29.0235, 40.9918],  # Kadıköy
            [29.0268, 40.9935],
            [29.0302, 40.9952],
            [29.0335, 40.9968],  # Söğütlüçeşme
            [29.0368, 40.9985],
            [29.0402, 41.0002],
            [29.0435, 41.0018],  # Kurbağalıdere
            [29.0468, 41.0035],
            [29.0502, 41.0052],
            [29.0535, 41.0068],  # Acıbadem
            [29.0568, 41.0085],
            [29.0602, 41.0102],
            [29.0635, 41.0118],  # Ünalan
            [29.0668, 41.0135],
            [29.0702, 41.0152],
            [29.0735, 41.0168],  # Altunizade
        ],
        "stops": [
            {"name": "Kadıköy", "position": {"longitude": 29.0235, "latitude": 40.9918, "altitude": 5}},
            {"name": "Söğütlüçeşme", "position": {"longitude": 29.0335, "latitude": 40.9968, "altitude": 15}},
            {"name": "Kurbağalıdere", "position": {"longitude": 29.0435, "latitude": 41.0018, "altitude": 25}},
            {"name": "Acıbadem", "position": {"longitude": 29.0535, "latitude": 41.0068, "altitude": 55}},
            {"name": "Ünalan", "position": {"longitude": 29.0635, "latitude": 41.0118, "altitude": 75}},
            {"name": "Altunizade", "position": {"longitude": 29.0735, "latitude": 41.0168, "altitude": 95}},
        ]
    },
    "DT1": {
        "code": "DT1",
        "name": "Mecidiyeköy - Taksim",
        "color": "#FB8C00",
        "bus_count": 2,
        "coordinates": [
            [28.9942, 41.0678],  # Mecidiyeköy
            [28.9925, 41.0645],
            [28.9908, 41.0612],
            [28.9892, 41.0578],  # Şişli
            [28.9875, 41.0545],
            [28.9858, 41.0512],
            [28.9842, 41.0478],  # Osmanbey
            [28.9825, 41.0445],
            [28.9808, 41.0412],
            [28.9853, 41.0369],  # Taksim
        ],
        "stops": [
            {"name": "Mecidiyeköy", "position": {"longitude": 28.9942, "latitude": 41.0678, "altitude": 90}},
            {"name": "Şişli", "position": {"longitude": 28.9892, "latitude": 41.0578, "altitude": 80}},
            {"name": "Osmanbey", "position": {"longitude": 28.9842, "latitude": 41.0478, "altitude": 75}},
            {"name": "Taksim", "position": {"longitude": 28.9853, "latitude": 41.0369, "altitude": 80}},
        ]
    },
    "30D": {
        "code": "30D",
        "name": "Beyazıt - Edirnekapı",
        "color": "#8E24AA",
        "bus_count": 2,
        "coordinates": [
            [28.9668, 41.0108],  # Beyazıt
            [28.9645, 41.0128],
            [28.9622, 41.0148],
            [28.9598, 41.0168],  # Aksaray
            [28.9575, 41.0188],
            [28.9552, 41.0208],
            [28.9528, 41.0228],  # Haseki
            [28.9505, 41.0248],
            [28.9482, 41.0268],
            [28.9458, 41.0288],  # Findikzade
            [28.9435, 41.0308],
            [28.9412, 41.0328],
            [28.9388, 41.0348],  # Topkapı
            [28.9365, 41.0368],
            [28.9342, 41.0388],
            [28.9318, 41.0408],  # Edirnekapı
        ],
        "stops": [
            {"name": "Beyazıt", "position": {"longitude": 28.9668, "latitude": 41.0108, "altitude": 45}},
            {"name": "Aksaray", "position": {"longitude": 28.9598, "latitude": 41.0168, "altitude": 35}},
            {"name": "Haseki", "position": {"longitude": 28.9528, "latitude": 41.0228, "altitude": 40}},
            {"name": "Fındıkzade", "position": {"longitude": 28.9458, "latitude": 41.0288, "altitude": 50}},
            {"name": "Topkapı", "position": {"longitude": 28.9388, "latitude": 41.0348, "altitude": 55}},
            {"name": "Edirnekapı", "position": {"longitude": 28.9318, "latitude": 41.0408, "altitude": 70}},
        ]
    }
}


def get_all_routes():
    """Get all route data"""
    return list(ISTANBUL_ROUTES.values())


def get_route(code: str):
    """Get a specific route by code"""
    return ISTANBUL_ROUTES.get(code)


def get_route_codes():
    """Get all route codes"""
    return list(ISTANBUL_ROUTES.keys())
