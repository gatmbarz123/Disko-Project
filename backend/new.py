from src.disko.image_management.image_controller import ImageController

controller = ImageController(db_file='src/disko/sqlite.py')
print(controller.calculate_amount_per_registry())