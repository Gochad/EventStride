from app import db
from .models import registrations

class Runner(db.Model):
    __tablename__ = 'runners'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    number = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    events = db.relationship('RaceEvent', secondary=registrations, back_populates='runners')
    results = db.relationship('Result', back_populates='runner')

    def register_for_race(self, race_event):
        if race_event not in self.events:
            self.events.append(race_event)