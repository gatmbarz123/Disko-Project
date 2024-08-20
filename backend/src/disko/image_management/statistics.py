from flask import Blueprint, request, jsonify
from image_controller import ImageController

image_controller = ImageController(db_file="src/disko/sqlite.py")
statistics_bp = Blueprint('statistics', __name__)

@statistics_bp.route('/api/statistics', methods=['GET'])
def get_image_statistics():
    cluster = request.args.get('cluster')
    if not cluster:
        return jsonify({"error": "Cluster parameter is required"}), 400

  

    # Calculate statistics
    amount_per_registry = image_controller.calculate_amount_per_registry()
    percentages = image_controller.calculate_percentages()

    # Combine the data for each registry without any row limits
    result = [
        {
            "registry_name": registry_name,
            "number_of_images": amount_per_registry[registry_name],
            "percentage": percentages[registry_name]
        }
        for registry_name in amount_per_registry
    ]

    return jsonify(result)
