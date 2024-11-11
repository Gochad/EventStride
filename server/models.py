from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

registrations = db.Table('registrations',
    db.Column('runner_id', db.Integer, db.ForeignKey('runners.id'), primary_key=True),
    db.Column('race_event_id', db.Integer, db.ForeignKey('race_events.id'), primary_key=True)
)

sponsorships = db.Table('sponsorships',
    db.Column('sponsor_id', db.Integer, db.ForeignKey('sponsors.id'), primary_key=True),
    db.Column('race_event_id', db.Integer, db.ForeignKey('race_events.id'), primary_key=True)
)

class Runner(db.Model):
    __tablename__ = 'runners'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)

    events = db.relationship('RaceEvent', secondary=registrations, back_populates='runners')

    results = db.relationship('Result', back_populates='runner')

    def register_for_race(self, race_event):
        if race_event not in self.events:
            self.events.append(race_event)

class RaceEvent(db.Model):
    __tablename__ = 'race_events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    distance = db.Column(db.Integer, nullable=False)

    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'))

    location = db.relationship('Location', back_populates='race_events')
    track = db.relationship('Track', back_populates='race_event', uselist=False)
    runners = db.relationship('Runner', secondary=registrations, back_populates='events')
    results = db.relationship('Result', back_populates='race_event')
    sponsors = db.relationship('Sponsor', secondary=sponsorships, back_populates='race_events')

    def add_runner(self, runner):
        if runner not in self.runners:
            self.runners.append(runner)

    def get_results(self):
        return sorted(self.results, key=lambda result: result.position)

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
