import traceback
from flask import Blueprint, jsonify, request
from src.disko.image_collector import ImageCollector
from src.disko.image_management.image_controller import ImageController
from src.disko.sqlite import SQLiteCRUD  
import os 
import logging

logging.basicConfig(level=logging.DEBUG)

postReq_bp = Blueprint('postReq_bp', __name__, url_prefix='/api')

@postReq_bp.route('/selected-cluster', methods=['POST'])
def select_cluster():
    data = request.json
    cluster = data.get('cluster')
    
    if not cluster:
        return jsonify({'error': 'No cluster selected'}), 400
    
    try:
        collector = ImageCollector()
        collector.collect_images(cluster)
        return jsonify({'message': f'Cluster {cluster} selected and processed successfully'}), 200
    except Exception as e:
        logging.error("Error in select_cluster: %s", traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    