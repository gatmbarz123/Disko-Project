from flask import Flask
from src.disko.image_management.clusters import cluster_bp
from src.disko.image_management.postReq import postReq_bp
from src.disko.image_management.statistics import getStatRes_bp
from src.disko.image_management.imageShow import imageShow_bp
from flask_cors import CORS 

def create_app():
    app = Flask(__name__)
    CORS(app,resources={r"/api/*": {"origins": "*"}})
    app.register_blueprint(cluster_bp)
    app.register_blueprint(postReq_bp)
    app.register_blueprint(getStatRes_bp)
    app.register_blueprint(imageShow_bp)

    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='127.0.0.1', port=5000, debug=True)
