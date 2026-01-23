"""
Pydantic models for the Fake GPS API
"""
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class BusStatus(str, Enum):
    IN_SERVICE = "IN_SERVICE"
    OUT_OF_SERVICE = "OUT_OF_SERVICE"
    AT_STOP = "AT_STOP"
    DELAYED = "DELAYED"


class Position(BaseModel):
    longitude: float
    latitude: float
    altitude: float = 50.0  # Default altitude for buses


class RouteStop(BaseModel):
    name: str
    position: Position


class Route(BaseModel):
    code: str
    name: str
    color: str
    coordinates: List[List[float]]  # [[lon, lat], [lon, lat], ...]
    stops: List[RouteStop]


class Bus(BaseModel):
    id: str
    routeCode: str
    routeName: str
    position: Position
    heading: float  # Degrees from north (0-360)
    speed: float  # km/h
    timestamp: datetime
    nextStop: Optional[str] = None
    status: BusStatus = BusStatus.IN_SERVICE
    progress: float = 0.0  # 0-1 progress along route
    color: Optional[str] = None


class BusListResponse(BaseModel):
    buses: List[Bus]
    timestamp: datetime
    count: int


class RouteListResponse(BaseModel):
    routes: List[Route]
    count: int


class WebSocketMessage(BaseModel):
    type: str  # "update", "init", "error"
    data: dict
    timestamp: datetime
