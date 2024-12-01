from flask import Flask
from flask_cors import CORS
from app.database import db, create_database
from routes.api import api
from app.config import Config
import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s',
    stream=sys.stdout
)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    app.register_blueprint(api, url_prefix='/api')
    
    create_database(app)
    
    return app