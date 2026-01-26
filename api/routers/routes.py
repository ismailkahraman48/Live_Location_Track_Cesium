"""
Routes Router - REST API endpoints for route data
"""
from typing import List
from fastapi import APIRouter, HTTPException
from models import Route, RouteListResponse, RouteStop, Position
from routes_data import get_all_routes, get_route, get_route_codes

router = APIRouter(prefix="/routes", tags=["routes"])


def _convert_route_data(route_data: dict) -> Route:
    """Convert raw route data to Route model"""
    stops = [
        RouteStop(
            name=stop["name"],
            position=Position(**stop["position"])
        )
        for stop in route_data["stops"]
    ]
    
    return Route(
        code=route_data["code"],
        name=route_data["name"],
        color=route_data["color"],
        coordinates=route_data["coordinates"],
        stops=stops
    )


@router.get("", response_model=RouteListResponse)
async def get_all_routes_endpoint():
    """
    Get all available bus routes.
    Returns route information including coordinates and stops.
    """
    routes_data = get_all_routes()
    routes = [_convert_route_data(r) for r in routes_data]
    
    return RouteListResponse(
        routes=routes,
        count=len(routes)
    )


@router.get("/codes", response_model=List[str])
async def get_route_codes_endpoint():
    """Get all route codes"""
    return get_route_codes()


@router.get("/{route_code}", response_model=Route)
async def get_route_endpoint(route_code: str):
    """
    Get a specific route by code.
    Returns detailed route information including all coordinates and stops.
    """
    route_data = get_route(route_code.upper())
    
    if not route_data:
        raise HTTPException(
            status_code=404, 
            detail=f"Route {route_code} not found"
        )
    
    return _convert_route_data(route_data)


@router.get("/{route_code}/coordinates")
async def get_route_coordinates(route_code: str):
    """
    Get only coordinates for a route (for drawing on map).
    Returns GeoJSON-compatible LineString format.
    """
    route_data = get_route(route_code.upper())
    
    if not route_data:
        raise HTTPException(
            status_code=404, 
            detail=f"Route {route_code} not found"
        )
    
    return {
        "type": "LineString",
        "coordinates": route_data["coordinates"],
        "properties": {
            "code": route_data["code"],
            "name": route_data["name"],
            "color": route_data["color"]
        }
    }


@router.get("/{route_code}/stops")
async def get_route_stops(route_code: str):
    """
    Get stops for a route in GeoJSON FeatureCollection format.
    Useful for map visualization.
    """
    route_data = get_route(route_code.upper())
    
    if not route_data:
        raise HTTPException(
            status_code=404, 
            detail=f"Route {route_code} not found"
        )
    
    features = []
    
    for stop in route_data["stops"]:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [stop["position"]["longitude"], stop["position"]["latitude"]]
            },
            "properties": {
                "name": stop["name"],
                "route_code": route_data["code"],
                "type": "STOP"
            }
        })
        
    return {
        "type": "FeatureCollection",
        "features": features
    }
