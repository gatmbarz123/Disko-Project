from flask import Blueprint, jsonify, request
from src.disko.image_collector import ImageCollector


# Define the Blueprint
postReq_bp = Blueprint('postReq_bp', __name__, url_prefix='/api')

@postReq_bp.route('/selected-cluster', methods=['POST'])
def select_cluster():
    data = request.json
    cluster = data.get('cluster')

    if not cluster:
        return jsonify({'error': 'No cluster selected'}), 400

    try:
        # Instantiate the ImageCollector class
        collector = ImageCollector()

        # Call the collect_images function with the selected cluster
        collector.collect_images(cluster)

        return jsonify({'message': f'Cluster {cluster} selected and images collected successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500