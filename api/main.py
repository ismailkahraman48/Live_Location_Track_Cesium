"""
IETT Live Bus Tracker - Fake GPS API
FastAPI application for simulating live bus positions in Istanbul
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from routers import buses, routes, websocket
from routes_data import get_route_codes
from bus_simulator import get_simulator

# Initialize FastAPI app
app = FastAPI(
    title="IETT Live Bus Tracker - Fake GPS API",
    description="""
    Simulates real-time bus positions for 5 Istanbul bus routes.
    
    ## Features
    - **12 buses** across **5 routes** moving in real-time
    - REST API for polling bus/route data
    - WebSocket for real-time updates (500ms intervals)
    - Smooth position interpolation for 3D visualization
    
    ## Routes
    - **34G**: Eminönü - Alibeyköy
    - **500T**: Taksim - Topkapı
    - **77A**: Kadıköy - Altunizade
    - **DT1**: Mecidiyeköy - Taksim
    - **30D**: Beyazıt - Edirnekapı
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(buses.router)
app.include_router(routes.router)
app.include_router(websocket.router)


@app.get("/", tags=["root"])
async def root():
    """API root - returns basic info and available endpoints"""
    simulator = get_simulator()
    
    return {
        "name": "IETT Live Bus Tracker - Fake GPS API",
        "version": "1.0.0",
        "description": "Simulates real-time bus positions in Istanbul",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "stats": {
            "total_buses": len(simulator.get_bus_ids()),
            "total_routes": len(get_route_codes()),
            "routes": get_route_codes()
        },
        "endpoints": {
            "buses": {
                "list_all": "GET /buses",
                "by_id": "GET /buses/{bus_id}",
                "by_route": "GET /buses/route/{route_code}",
                "ids": "GET /buses/ids"
            },
            "routes": {
                "list_all": "GET /routes",
                "by_code": "GET /routes/{route_code}",
                "codes": "GET /routes/codes",
                "coordinates": "GET /routes/{route_code}/coordinates"
            },
            "websocket": {
                "all_buses": "WS /ws/buses",
                "by_route": "WS /ws/buses/{route_code}",
                "status": "GET /ws/status"
            },
            "docs": {
                "swagger": "GET /docs",
                "redoc": "GET /redoc"
            }
        }
    }


@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080, reload=True)
