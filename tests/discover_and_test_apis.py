import importlib
import pytest
from flask import Flask
API_SERVERS = [
    # List all known API server modules (adjust the module paths as per your project structure)
]

@pytest.mark.parametrize("api_server", API_SERVERS)
def test_discover_and_test_apis(api_server):
    """
    Discover all routes in the specified API server module and send basic requests.
    """
    module = importlib.import_module(api_server)
    app = getattr(module, 'app', None)

    if app and isinstance(app, Flask):
        client = app.test_client()

        # Discover all routes in the Flask app
        routes = [rule.rule for rule in app.url_map.iter_rules()]
        for route in routes:
            # Skip routes that are not GET (customize if needed)
            methods = [method for method in app.url_map.iter_rules(route)][0].methods
            if 'GET' in methods:
                response = client.get(route)
                assert response.status_code == 200, f"Failed on route: {route} in {api_server}"
    else:
        pytest.fail(f"No Flask app found in module {api_server}")