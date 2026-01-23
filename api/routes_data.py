"""
Istanbul Bus Routes Data - Multiple Routes imported from individual files
Each route contains coordinates (lon, lat) and stop information
"""
from routes_data import ALL_ROUTES

ISTANBUL_ROUTES = ALL_ROUTES

def get_all_routes():
    """Get all route data"""
    return list(ISTANBUL_ROUTES.values())


def get_route(code: str):
    """Get a specific route by code"""
    return ISTANBUL_ROUTES.get(code)


def get_route_codes():
    """Get all route codes"""
    return list(ISTANBUL_ROUTES.keys())
