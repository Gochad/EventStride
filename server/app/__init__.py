from flask import Flask
from flask_cors import CORS
import logging
import sys
import os
import stripe
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

from app.database import db, create_database
from routes.api import api
from app.config import Config
from auth.routes import google_bp
from routes.payments import checkout_bp

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s',
    stream=sys.stdout
)

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.secret_key = os.getenv("SECRET_KEY",  "a-secure-random-key")

    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

    app.config.from_object(Config)
    db.init_app(app)

    CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}}, supports_credentials=True)
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(google_bp, url_prefix="/auth")
    app.register_blueprint(checkout_bp, url_prefix='/checkout')

    jwt = JWTManager(app)
    
    create_database(app)
    
    return app