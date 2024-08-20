import importlib
import os
import pytest
from flask import Flask

def discover_flask_apps():
    """
    Discover all Flask apps in the backend directory.
    This assumes that each API server is a separate Python module with a Flask app.
    """
    flask_apps = []
    for root, dirs, files in os.walk('backend'):
        for file in files:
            if file.endswith('.py'):
                module_name = os.path.splitext(os.path.relpath(os.path.join(root, file), 'backend'))[0].replace(os.sep, '.')
                flask_apps.append(f'backend.{module_name}')
    return flask_apps

@pytest.mark.parametrize("api_server", discover_flask_apps())
def test_discover_and_test_apis(api_server):
    """
    Discover all routes in the specified API server module and send basic requests.
    """
    try:
        module = importlib.import_module(api_server)
        app = getattr(module, 'app', None)

        if app and isinstance(app, Flask):
            client = app.test_client()

            # Discover all routes in the Flask app
            routes = [rule.rule for rule in app.url_map.iter_rules()]
            for route in routes:
                # Skip routes that are not GET (customize if needed)
                methods = {method for method in app.url_map.iter_rules(route)}.pop().methods
                if 'GET' in methods:
                    response = client.get(route)
                    assert response.status_code == 200, f"Failed on route: {route} in {api_server}"
        else:
            pytest.fail(f"No Flask app found in module {api_server}")
    except Exception as e:
        pytest.fail(f"Failed to test {api_server} due to {e}")