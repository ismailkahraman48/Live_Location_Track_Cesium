"""
WebSocket Router - Real-time bus position updates
"""
import asyncio
import json
from datetime import datetime, timezone
from typing import Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from bus_simulator import get_simulator

router = APIRouter(tags=["websocket"])


class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
    
    async def broadcast(self, message: dict):
        """Send message to all connected clients"""
        disconnected = set()
        
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.add(connection)
        
        # Remove disconnected clients
        self.active_connections -= disconnected
    
    @property
    def connection_count(self):
        return len(self.active_connections)


manager = ConnectionManager()


def serialize_bus(bus) -> dict:
    """Serialize bus object to JSON-compatible dict"""
    return {
        "id": bus.id,
        "routeCode": bus.routeCode,
        "routeName": bus.routeName,
        "position": {
            "longitude": bus.position.longitude,
            "latitude": bus.position.latitude,
            "altitude": bus.position.altitude
        },
        "heading": bus.heading,
        "speed": bus.speed,
        "timestamp": bus.timestamp.isoformat(),
        "nextStop": bus.nextStop,
        "status": bus.status.value,
        "progress": bus.progress,
        "color": bus.color
    }


@router.websocket("/ws/buses")
async def websocket_buses(websocket: WebSocket):
    """
    WebSocket endpoint for real-time bus updates.
    Sends position updates every 500ms for smooth animation.
    
    Message format:
    {
        "type": "update",
        "buses": [...],
        "timestamp": "ISO8601",
        "count": 12
    }
    """
    await manager.connect(websocket)
    simulator = get_simulator()
    
    try:
        # Send initial data
        buses = simulator.get_all_buses()
        await websocket.send_json({
            "type": "init",
            "buses": [serialize_bus(b) for b in buses],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "count": len(buses)
        })
        
        # Continuous updates
        while True:
            await asyncio.sleep(5) 
            
            buses = simulator.get_all_buses()
            await websocket.send_json({
                "type": "update",
                "buses": [serialize_bus(b) for b in buses],
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "count": len(buses)
            })
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        manager.disconnect(websocket)
        print(f"WebSocket error: {e}")


@router.websocket("/ws/buses/{route_code}")
async def websocket_buses_by_route(websocket: WebSocket, route_code: str):
    """
    WebSocket endpoint for real-time updates of buses on a specific route.
    """
    await manager.connect(websocket)
    simulator = get_simulator()
    
    try:
        # Send initial data
        buses = simulator.get_buses_by_route(route_code.upper())
        await websocket.send_json({
            "type": "init",
            "routeCode": route_code.upper(),
            "buses": [serialize_bus(b) for b in buses],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "count": len(buses)
        })
        
        # Continuous updates
        while True:
            await asyncio.sleep(0.5)
            
            buses = simulator.get_buses_by_route(route_code.upper())
            await websocket.send_json({
                "type": "update",
                "routeCode": route_code.upper(),
                "buses": [serialize_bus(b) for b in buses],
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "count": len(buses)
            })
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


@router.get("/ws/status")
async def websocket_status():
    """Get WebSocket connection status"""
    return {
        "active_connections": manager.connection_count,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
