import importlib.util
import os
import pytest
from flask import Flask

def find_flask_servers(directory="backend"):
    flask_servers = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if "from flask import Flask" in content or "import Flask" in content:
                        if "Flask(__name__)" in content or "Flask(" in content:
                            flask_servers.append(file_path)
    
    return flask_servers

def find_flask_app(module):
    """
    Find a Flask app instance within the given module.
    """
    for attribute_name in dir(module):
        attribute = getattr(module, attribute_name)
        if isinstance(attribute, Flask):
            return attribute
    return None

@pytest.mark.parametrize("api_file", find_flask_servers())
def test_discover_and_test_apis(api_file):
    
    if not api_file:
        pytest.skip("No Flask servers found.")
    print(f"Testing Flask app in file: {api_file}")
    
    try:
        # Dynamically load the module from the file path
        spec = importlib.util.spec_from_file_location("module.name", api_file)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        # Dynamically find the Flask app instance
        app = find_flask_app(module)

        if app:
            client = app.test_client()

            # Discover all routes in the Flask app
            routes = [rule.rule for rule in app.url_map.iter_rules()]
            for route in routes:
                # Only test GET routes
                methods = {method for method in app.url_map.iter_rules(route)}.pop().methods
                if 'GET' in methods:
                    response = client.get(route)
                    assert response.status_code == 200, f"Failed on route: {route} in {api_file}"
        else:
            pytest.fail(f"No Flask app found in file {api_file}")
    except Exception as e:
        pytest.fail(f"Failed to test {api_file} due to {e}")

