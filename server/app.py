from flask import Flask
from flask_cors import CORS 
from config import Config
from routes import api
from models import db
import time
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
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
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.register_blueprint(api, url_prefix='/api')
    
    create_database(app)
    
    return app

def create_database(app):
    with app.app_context():
        wait_for_db(app)
        db.create_all()
        logging.info('Database tables created!')

def wait_for_db(app):
    retries = 10
    while retries > 0:
        try:
            with app.app_context():
                with db.engine.begin() as connection:
                    connection.execute(text("SELECT 1"))
            logging.info("Database is ready!")
            return
        except OperationalError:
            logging.info("Waiting for database to become available...")
            retries -= 1
            time.sleep(3)
    logging.error("Could not connect to the database. Exiting.")
    exit(1)

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000) 
