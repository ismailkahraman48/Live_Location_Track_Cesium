"""
Bus Simulator - Simulates bus movement along routes
Provides real-time position updates with smooth interpolation
"""
import math
import time
from datetime import datetime, timezone
from typing import Dict, List, Optional
from models import Bus, Position, BusStatus
from routes_data import ISTANBUL_ROUTES, get_all_routes


class BusSimulator:
    """
    Simulates multiple buses moving along predefined routes.
    Each bus moves at a variable speed and loops back at the end of the route.
    """
    
    def __init__(self):
        self.buses: Dict[str, dict] = {}
        self.start_time = time.time()
        self._initialize_buses()
    
    def _initialize_buses(self):
        """Initialize all buses from route data"""
        for route_code, route_data in ISTANBUL_ROUTES.items():
            bus_count = route_data.get("bus_count", 2)
            coordinates = route_data["coordinates"]
            total_segments = len(coordinates) - 1
            
            for i in range(bus_count):
                bus_id = f"{route_code}-{str(i + 1).zfill(3)}"
                
                # Distribute buses along the route initially
                initial_progress = i / bus_count
                
                # Random speed variation (20-45 km/h)
                base_speed = 25 + (i * 7) % 20
                
                self.buses[bus_id] = {
                    "id": bus_id,
                    "route_code": route_code,
                    "route_name": route_data["name"],
                    "coordinates": coordinates,
                    "stops": route_data["stops"],
                    "color": route_data["color"],
                    "progress": initial_progress,  # 0-1 progress along route
                    "direction": 1,  # 1 = forward, -1 = backward
                    "base_speed": base_speed,
                    "current_speed": base_speed,
                    "status": BusStatus.IN_SERVICE,
                    "last_update": time.time(),
                }
    
    def _calculate_distance(self, coord1: List[float], coord2: List[float]) -> float:
        """Calculate distance between two coordinates in km using Haversine formula"""
        lon1, lat1 = math.radians(coord1[0]), math.radians(coord1[1])
        lon2, lat2 = math.radians(coord2[0]), math.radians(coord2[1])
        
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        
        # Earth radius in km
        r = 6371
        return c * r
    
    def _calculate_heading(self, from_coord: List[float], to_coord: List[float]) -> float:
        """Calculate heading (bearing) from one coordinate to another"""
        lon1, lat1 = math.radians(from_coord[0]), math.radians(from_coord[1])
        lon2, lat2 = math.radians(to_coord[0]), math.radians(to_coord[1])
        
        dlon = lon2 - lon1
        
        x = math.sin(dlon) * math.cos(lat2)
        y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlon)
        
        bearing = math.atan2(x, y)
        bearing = math.degrees(bearing)
        
        # Normalize to 0-360
        return (bearing + 360) % 360
    
    def _get_total_route_length(self, coordinates: List[List[float]]) -> float:
        """Calculate total route length in km"""
        total = 0
        for i in range(len(coordinates) - 1):
            total += self._calculate_distance(coordinates[i], coordinates[i + 1])
        return total
    
    def _interpolate_position(self, coordinates: List[List[float]], progress: float) -> tuple:
        """
        Interpolate position along the route based on progress (0-1).
        Returns (longitude, latitude, heading, segment_index)
        """
        if progress <= 0:
            heading = self._calculate_heading(coordinates[0], coordinates[1])
            return coordinates[0][0], coordinates[0][1], heading, 0
        
        if progress >= 1:
            heading = self._calculate_heading(coordinates[-2], coordinates[-1])
            return coordinates[-1][0], coordinates[-1][1], heading, len(coordinates) - 2
        
        # Calculate total route length and find position
        total_length = self._get_total_route_length(coordinates)
        target_distance = progress * total_length
        
        accumulated_distance = 0
        for i in range(len(coordinates) - 1):
            segment_length = self._calculate_distance(coordinates[i], coordinates[i + 1])
            
            if accumulated_distance + segment_length >= target_distance:
                # Found the segment
                remaining = target_distance - accumulated_distance
                segment_progress = remaining / segment_length if segment_length > 0 else 0
                
                # Linear interpolation
                lon = coordinates[i][0] + (coordinates[i + 1][0] - coordinates[i][0]) * segment_progress
                lat = coordinates[i][1] + (coordinates[i + 1][1] - coordinates[i][1]) * segment_progress
                heading = self._calculate_heading(coordinates[i], coordinates[i + 1])
                
                return lon, lat, heading, i
            
            accumulated_distance += segment_length
        
        # Fallback
        heading = self._calculate_heading(coordinates[-2], coordinates[-1])
        return coordinates[-1][0], coordinates[-1][1], heading, len(coordinates) - 2
    
    def _find_next_stop(self, bus_data: dict, current_position: tuple) -> Optional[str]:
        """Find the next stop based on current position and direction"""
        stops = bus_data["stops"]
        coordinates = bus_data["coordinates"]
        direction = bus_data["direction"]
        
        current_lon, current_lat = current_position[0], current_position[1]
        
        # Find closest stop ahead
        min_distance = float('inf')
        next_stop = None
        
        for stop in stops:
            stop_lon = stop["position"]["longitude"]
            stop_lat = stop["position"]["latitude"]
            
            distance = self._calculate_distance(
                [current_lon, current_lat],
                [stop_lon, stop_lat]
            )
            
            # Check if stop is ahead based on direction
            if direction == 1:
                # Going forward
                if stop_lat > current_lat and distance < min_distance:
                    min_distance = distance
                    next_stop = stop["name"]
            else:
                # Going backward
                if stop_lat < current_lat and distance < min_distance:
                    min_distance = distance
                    next_stop = stop["name"]
        
        return next_stop or stops[-1 if direction == 1 else 0]["name"]
    
    def _update_bus_position(self, bus_id: str, current_time: float) -> dict:
        """Update a single bus position based on elapsed time"""
        bus_data = self.buses[bus_id]
        
        # Time since last update
        dt = current_time - bus_data["last_update"]
        bus_data["last_update"] = current_time
        
        # Speed simulation with traffic variation
        traffic_factor = 0.7 + 0.6 * math.sin(current_time * 0.1 + hash(bus_id) % 10)
        current_speed = bus_data["base_speed"] * traffic_factor
        bus_data["current_speed"] = max(5, min(50, current_speed))  # Clamp between 5-50 km/h
        
        # Calculate distance traveled
        distance_km = (current_speed / 3600) * dt  # Convert km/h to km/s
        
        # Calculate progress change
        total_length = self._get_total_route_length(bus_data["coordinates"])
        progress_delta = distance_km / total_length if total_length > 0 else 0
        
        # Update progress
        new_progress = bus_data["progress"] + (progress_delta * bus_data["direction"])
        
        # Handle route ends (bounce back)
        if new_progress >= 1:
            new_progress = 1 - (new_progress - 1)
            bus_data["direction"] = -1
        elif new_progress <= 0:
            new_progress = -new_progress
            bus_data["direction"] = 1
        
        bus_data["progress"] = new_progress
        
        # Interpolate position
        lon, lat, heading, segment = self._interpolate_position(
            bus_data["coordinates"], 
            new_progress
        )
        
        # Adjust heading for direction
        if bus_data["direction"] == -1:
            heading = (heading + 180) % 360
        
        # Find next stop
        next_stop = self._find_next_stop(bus_data, (lon, lat))
        
        # Simulate occasional stops
        if hash(str(current_time)[:5] + bus_id) % 20 == 0:
            bus_data["status"] = BusStatus.AT_STOP
        elif hash(str(current_time)[:5] + bus_id) % 30 == 0:
            bus_data["status"] = BusStatus.DELAYED
        else:
            bus_data["status"] = BusStatus.IN_SERVICE
        
        return {
            "id": bus_id,
            "route_code": bus_data["route_code"],
            "route_name": bus_data["route_name"],
            "position": {
                "longitude": round(lon, 6),
                "latitude": round(lat, 6),
                "altitude": 50 + segment * 2  # Slight altitude variation
            },
            "heading": round(heading, 1),
            "speed": round(bus_data["current_speed"], 1),
            "next_stop": next_stop,
            "status": bus_data["status"],
            "progress": round(new_progress, 4),
            "direction": "outbound" if bus_data["direction"] == 1 else "inbound",
            "color": bus_data["color"]
        }
    
    def get_all_buses(self) -> List[Bus]:
        """Get current state of all buses"""
        current_time = time.time()
        buses = []
        
        for bus_id in self.buses:
            bus_state = self._update_bus_position(bus_id, current_time)
            buses.append(Bus(
                id=bus_state["id"],
                routeCode=bus_state["route_code"],
                routeName=bus_state["route_name"],
                position=Position(**bus_state["position"]),
                heading=bus_state["heading"],
                speed=bus_state["speed"],
                timestamp=datetime.now(timezone.utc),
                nextStop=bus_state["next_stop"],
                status=bus_state["status"],
                progress=bus_state["progress"],
                color=bus_state["color"]
            ))
        
        return buses
    
    def get_bus(self, bus_id: str) -> Optional[Bus]:
        """Get current state of a specific bus"""
        if bus_id not in self.buses:
            return None
        
        current_time = time.time()
        bus_state = self._update_bus_position(bus_id, current_time)
        
        return Bus(
            id=bus_state["id"],
            routeCode=bus_state["route_code"],
            routeName=bus_state["route_name"],
            position=Position(**bus_state["position"]),
            heading=bus_state["heading"],
            speed=bus_state["speed"],
            timestamp=datetime.now(timezone.utc),
            nextStop=bus_state["next_stop"],
            status=bus_state["status"],
            progress=bus_state["progress"],
            color=bus_state["color"]
        )
    
    def get_buses_by_route(self, route_code: str) -> List[Bus]:
        """Get all buses on a specific route"""
        current_time = time.time()
        buses = []
        
        for bus_id, bus_data in self.buses.items():
            if bus_data["route_code"] == route_code:
                bus_state = self._update_bus_position(bus_id, current_time)
                buses.append(Bus(
                    id=bus_state["id"],
                    routeCode=bus_state["route_code"],
                    routeName=bus_state["route_name"],
                    position=Position(**bus_state["position"]),
                    heading=bus_state["heading"],
                    speed=bus_state["speed"],
                    timestamp=datetime.now(timezone.utc),
                    nextStop=bus_state["next_stop"],
                    status=bus_state["status"],
                    progress=bus_state["progress"],
                    color=bus_state["color"]
                ))
        
        return buses
    
    def get_bus_ids(self) -> List[str]:
        """Get all bus IDs"""
        return list(self.buses.keys())


# Global simulator instance
simulator = BusSimulator()


def get_simulator() -> BusSimulator:
    """Get the global simulator instance"""
    return simulator
