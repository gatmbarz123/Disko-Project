from src.disko.image_management.image_controller import ImageController

db_path = '/home/keretdodor/Desktop/disko-project/backend/image_data.db'  # Absolute path

cluster= 'kind-cluster1'
controller = ImageController(db_path)

print(controller.calculate_percentages(cluster))