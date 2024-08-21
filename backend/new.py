from src.disko.image_management.image_controller import ImageController

controller = ImageController('')
image= ["docker.io/kindest/local-path-provisioner:v20240202-8f1494ea"]

controller.copy_images(image,"diskoproject/repo_1.0","v20240202-8f1494ea","diskoproject","barbar13241324")
