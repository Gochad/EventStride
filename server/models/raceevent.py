from app import db
from .models import registrations, sponsorships

class RaceEvent(db.Model):
    __tablename__ = 'race_events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    distance = db.Column(db.Integer, nullable=False)

    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), nullable=False)

    location = db.relationship('Location', back_populates='race_events', lazy='joined')
    track = db.relationship('Track', back_populates='race_event', uselist=False, lazy='joined')
    runners = db.relationship('Runner', secondary=registrations, back_populates='events', lazy='dynamic')
    results = db.relationship('Result', back_populates='race_event', cascade="all, delete-orphan", lazy='subquery')
    sponsors = db.relationship('Sponsor', secondary=sponsorships, back_populates='race_events', lazy='subquery')

    def add_runner(self, runner):
        """
        Add a runner to the race event if they are not already registered.
        """
        if runner not in self.runners:
            self.runners.append(runner)

    def get_results(self):
        """
        Get results for the event, sorted by position.
        """
        return sorted(self.results, key=lambda result: result.position)

    def add_sponsor(self, sponsor):
        """
        Add a sponsor to the race event if not already added.
        """
        if sponsor not in self.sponsors:
            self.sponsors.append(sponsor)

    def __repr__(self):
        return f"<RaceEvent {self.name}>"
