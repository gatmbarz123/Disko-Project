import os
import sys
import importlib.util
import pytest
import ast
import re  
from flask import Flask

def find_flask_servers(directory="backend"):
    """Recursively find Flask servers by scanning Python files."""
    print(f"Scanning directory: {os.path.abspath(directory)}")
    flask_servers = []
    flask_import_pattern = re.compile(r'^\s*(from\s+flask\s+import\s+.*|import\s+flask.*)', re.MULTILINE)
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if re.search(flask_import_pattern, content):
                            flask_servers.append(file_path)
                            print(f"Found Flask server candidate in: {file_path}")
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    return flask_servers

def find_flask_app(module):
    """Find a Flask app instance within the given module."""
    for attribute_name in dir(module):
        attribute = getattr(module, attribute_name)
        if isinstance(attribute, Flask):
            print(f"Found Flask app instance: {attribute_name}")
            return attribute
    return None

def add_to_pythonpath(directory):
    """Add the given directory to PYTHONPATH."""
    abs_path = os.path.abspath(directory)
    if abs_path not in sys.path:
        sys.path.append(abs_path)
        print(f"Added {abs_path} to PYTHONPATH.")

def test_discover_and_test_apis(api_file):
    """Test a single Flask server file."""
    if not api_file:
        pytest.skip("No Flask servers found.")
    print(f"Testing Flask app in file: {api_file}")

    # Add the file's directory to PYTHONPATH to handle imports correctly
    file_directory = os.path.dirname(api_file)
    add_to_pythonpath(file_directory)
    
    try:
        # Dynamically load the module from the file path
        module_name = os.path.splitext(os.path.basename(api_file))[0]
        spec = importlib.util.spec_from_file_location(module_name, api_file)
        module = importlib.util.module_from_spec(spec)
        
        try:
            spec.loader.exec_module(module)
        except Exception as e:
            pytest.fail(f"Failed to load module {api_file} due to: {e}")
            return

        # Find the Flask app instance
        app = find_flask_app(module)

        if app:
            client = app.test_client()

            # Check that the Flask app can process requests
            for rule in app.url_map.iter_rules():
                if 'GET' in rule.methods and not rule.arguments:
                    try:
                        response = client.get(rule.rule)
                        assert response.status_code in [200, 404], (
                            f"Unexpected status code {response.status_code} for route {rule.rule} in {api_file}"
                        )
                        print(f"Route {rule.rule} in {api_file} processed successfully with status code {response.status_code}")
                    except Exception as e:
                        pytest.fail(f"Failed to process route {rule.rule} in {api_file} due to: {e}")
        else:
            pytest.skip(f"No Flask app found in file {api_file}")
    except Exception as e:
        pytest.fail(f"Failed to test {api_file} due to: {e}")

if __name__ == "__main__":
    # Find all Flask servers
    flask_servers = find_flask_servers()
    
    if not flask_servers:
        print("No Flask servers found to test.")
    else:
        # Run the test for each Flask server found
        for flask_server in flask_servers:
            test_discover_and_test_apis(flask_server)
