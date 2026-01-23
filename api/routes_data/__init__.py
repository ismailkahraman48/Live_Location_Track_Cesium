import os
import importlib
import pkgutil

ALL_ROUTES = {}

# Get the directory of the current package
package_dir = os.path.dirname(__file__)

# Iterate over all files in the directory
for module_loader, name, ispkg in pkgutil.iter_modules([package_dir]):
    # We only care about route_*.py files
    if name.startswith("route_") and not ispkg:
        try:
            # Import the module
            module = importlib.import_module(f".{name}", package=__name__)
            
            # Find the route variable in the module
            # Convention: route_30d.py -> ROUTE_30D
            # Or iterate variables looking for one that looks like a route dict
            
            route_variable_name = name.upper()
            if hasattr(module, route_variable_name):
                route_data = getattr(module, route_variable_name)
                if isinstance(route_data, dict) and "code" in route_data:
                    ALL_ROUTES[route_data["code"]] = route_data
        except ImportError as e:
            print(f"Error importing {name}: {e}")

# Legacy support / Interface compatibility
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
