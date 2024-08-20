from src.disko.image_collector import ImageCollector
from src.disko.sqlite import *

controller = ImageCollector()
# ctl1 = sqlite.SQLiteCRUD("image_data.db")

#print(controller.initialize_db("doker.db"))
cluster="kind-kind"

print(controller.collect_images(cluster))