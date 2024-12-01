from app import db
from .models import sponsorships

class Sponsor(db.Model):
    __tablename__ = 'sponsors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    logo = db.Column(db.String(200))
    type = db.Column(db.String(50), nullable=False)

    race_events = db.relationship('RaceEvent', secondary=sponsorships, back_populates='sponsors')

