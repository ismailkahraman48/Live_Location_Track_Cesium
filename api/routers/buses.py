"""
Buses Router - REST API endpoints for bus data
"""
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query
from models import Bus, BusListResponse
from bus_simulator import get_simulator

router = APIRouter(prefix="/buses", tags=["buses"])


@router.get("", response_model=BusListResponse)
async def get_all_buses(
    route_code: Optional[str] = Query(None, description="Filter by route code")
):
    """
    Get all buses or filter by route code.
    Returns real-time positions of all active buses.
    """
    simulator = get_simulator()
    
    if route_code:
        buses = simulator.get_buses_by_route(route_code.upper())
    else:
        buses = simulator.get_all_buses()
    
    return BusListResponse(
        buses=buses,
        timestamp=datetime.now(timezone.utc),
        count=len(buses)
    )


@router.get("/ids", response_model=List[str])
async def get_bus_ids():
    """Get all bus IDs"""
    simulator = get_simulator()
    return simulator.get_bus_ids()


@router.get("/{bus_id}", response_model=Bus)
async def get_bus(bus_id: str):
    """
    Get a specific bus by ID.
    Returns detailed information about the bus including position, speed, and next stop.
    """
    simulator = get_simulator()
    bus = simulator.get_bus(bus_id.upper())
    
    if not bus:
        raise HTTPException(status_code=404, detail=f"Bus {bus_id} not found")
    
    return bus


@router.get("/route/{route_code}", response_model=BusListResponse)
async def get_buses_by_route(route_code: str):
    """
    Get all buses on a specific route.
    """
    simulator = get_simulator()
    buses = simulator.get_buses_by_route(route_code.upper())
    
    if not buses:
        raise HTTPException(
            status_code=404, 
            detail=f"No buses found for route {route_code}"
        )
    
    return BusListResponse(
        buses=buses,
        timestamp=datetime.now(timezone.utc),
        count=len(buses)
    )
