from app import db
from .models import registrations, sponsorships

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

    def add_sponsor(self, sponsor):
        if sponsor not in self.sponsors:
            self.sponsors.append(sponsor)
