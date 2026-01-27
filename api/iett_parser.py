import json
import re
from urllib.request import Request, urlopen
from typing import Dict, List, Any, Optional

def fetch_and_parse_iett_data(route_code: str) -> Optional[Dict[str, Any]]:
   
    query_param = f"{route_code}_D_D0"
    url = f"https://iett.istanbul/tr/RouteStation/GetRoutePinV2?q={query_param}"
    
    try:
        req = Request(url)
        with urlopen(req) as response:
            content = response.read()
            
            if content.startswith(b'\xef\xbb\xbf'):
                content = content[3:]
            data = json.loads(content)
    except Exception as e:
        print(f"Veri cekilirken hata olustu: {e}")
        return None
        
    if not data or not isinstance(data, list) or len(data) == 0:
        print("Gecersiz veri formati veya bos yanit.")
        return None
        
    route_data = data[0]
    
    
    full_line_string = route_data.get("line", "")
    coordinates = []
    
    if full_line_string:
        
        linestrings = full_line_string.split("|")
        
        for ls in linestrings:
            
            clean_ls = re.sub(r"LINESTRING\s*\(|\)", "", ls)
            points = clean_ls.split(",")
            
            for point in points:
                coords = point.strip().split(" ")
                if len(coords) >= 2:
                    try:
                        lon = float(coords[0])
                        lat = float(coords[1])
                        coordinates.append([lon, lat])
                    except ValueError:
                        continue
    
    stations = route_data.get("stationPlaces", [])
    stops = []
    
    for station in stations:
        try:
            stops.append({
                "name": station.get("stationName", "").strip(),
                "position": {
                    "longitude": float(station.get("lng")),
                    "latitude": float(station.get("lat")),
                    "altitude": 0
                }
            })
        except (ValueError, TypeError):
            continue

    code = route_code
    
    color = route_data.get("lineColor", "#049ae5")
    if color and not color.startswith("#"):
        color = f"#{color}"

    result = {
        "code": code,
        "name": f"{code} Hattı", 
        "color": color,
        "bus_count": 0, 
        "coordinates": coordinates,
        "stops": stops
    }
    
    return result

import sys
import os
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='IETT Hat Verisi Çekme Aracı')
    parser.add_argument('route_code', type=str, help='Hat kodu (örn: 30D)')
    parser.add_argument('--bus-count', type=int, default=2, help='Hatta tanımlanacak otobüs sayısı (varsayılan: 2)')
    
    args = parser.parse_args()
    
    routes_dir = os.path.join(os.path.dirname(__file__), "routes_data")
    if not os.path.exists(routes_dir):
        os.makedirs(routes_dir)
        
    print(f"'{args.route_code}' için veri çekiliyor...")
    parsed_data = fetch_and_parse_iett_data(args.route_code)
    
    if parsed_data:
        # Bus count'u güncelle
        parsed_data["bus_count"] = args.bus_count
        
        print(f"Rota Kodu: {parsed_data['code']}")
        print(f"Koordinat Sayısı: {len(parsed_data['coordinates'])}")
        print(f"Durak Sayısı: {len(parsed_data['stops'])}")
        
        # Dosyaya kaydet
        file_name = f"route_{args.route_code.lower()}.py"
        file_path = os.path.join(routes_dir, file_name)
        
        var_name = f"ROUTE_{args.route_code.upper()}"
        
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(f'{var_name} = {json.dumps(parsed_data, ensure_ascii=False, indent=4)}\n')
            print(f"Başarıyla kaydedildi: {file_path}")
        except Exception as e:
            print(f"Dosya kaydedilirken hata oluştu: {e}")
            
    else:
        print("Veri alınamadı ve kaydedilmedi.")
