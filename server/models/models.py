from datetime import datetime
from . import db

registrations = db.Table('registrations',
    db.Column('runner_id', db.Integer, db.ForeignKey('runners.id'), primary_key=True),
    db.Column('race_event_id', db.Integer, db.ForeignKey('race_events.id'), primary_key=True)
)

sponsorships = db.Table('sponsorships',
    db.Column('sponsor_id', db.Integer, db.ForeignKey('sponsors.id'), primary_key=True),
    db.Column('race_event_id', db.Integer, db.ForeignKey('race_events.id'), primary_key=True)
)

class Track(db.Model):
    __tablename__ = 'tracks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    distance = db.Column(db.Integer, nullable=False)
    difficulty_level = db.Column(db.String(50), nullable=False)

    race_event = db.relationship('RaceEvent', back_populates='track', uselist=False)

class Sponsor(db.Model):
    __tablename__ = 'sponsors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    logo = db.Column(db.String(200))
    type = db.Column(db.String(50), nullable=False)

    race_events = db.relationship('RaceEvent', secondary=sponsorships, back_populates='sponsors')

    def provide_sponsorship(self, race_event):
        if race_event not in self.race_events:
            self.race_events.append(race_event)

class Result(db.Model):
    __tablename__ = 'results'
    id = db.Column(db.Integer, primary_key=True)
    position = db.Column(db.Integer)
    finish_time = db.Column(db.Time)

    runner_id = db.Column(db.Integer, db.ForeignKey('runners.id'), nullable=False)
    race_event_id = db.Column(db.Integer, db.ForeignKey('race_events.id'), nullable=False)

    runner = db.relationship('Runner', back_populates='results')
    race_event = db.relationship('RaceEvent', back_populates='results')

    def calculate_final_position(self):
        pass

class Location(db.Model):
    __tablename__ = 'locations'
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)

    race_events = db.relationship('RaceEvent', back_populates='location')
