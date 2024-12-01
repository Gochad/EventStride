from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
import time
import logging

db = SQLAlchemy()

def create_database(app):
    with app.app_context():
        wait_for_db()
        db.create_all()
        logging.info('Database tables created!')

def wait_for_db():
    retries = 10
    while retries > 0:
        try:
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
