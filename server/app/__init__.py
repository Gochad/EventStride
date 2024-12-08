from flask import Flask
from flask_cors import CORS
import logging
import sys
from app.database import db, create_database
from routes.api import api
from app.config import Config
from auth.routes import google_bp

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s',
    stream=sys.stdout
)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(google_bp, url_prefix="/login")
    
    create_database(app)
    
    return app