from flask import Blueprint, jsonify, request
from src.disko.image_management.image_controller import ImageController

image_controller = ImageController(db_file="src/disko/sqlite.py")
# Create a Blueprint for cluster-related routes
cluster_bp = Blueprint('cluster', __name__)

@cluster_bp.route('/api/clusters', methods=['GET'])
def get_clusters():
   
    clusters = image_controller.get_kubernetes_clusters()
    return jsonify(clusters)


cluster_data = Blueprint('api', __name__)


