from app import db
from models.raceevent import RaceEvent
from models.sponsor import Sponsor

class SponsorService:
    @staticmethod
    def create_sponsor(data):
        if not data.get('name') or not data.get('type'):
            raise ValueError("Name and type are required fields.")

        new_sponsor = Sponsor(
            name=data['name'],
            logo=data.get('logo'),
            type=data['type']
        )

        db.session.add(new_sponsor)
        db.session.commit()

        return new_sponsor
    
    @staticmethod
    def add_sponsor_to_event(event_id, sponsor_data):
        event = RaceEvent.query.get_or_404(event_id)

        sponsor = Sponsor.query.filter_by(name=sponsor_data['name']).first()
        if not sponsor:
            sponsor = Sponsor(
                name=sponsor_data['name'],
                logo=sponsor_data.get('logo'),
                type=sponsor_data['type']
            )
            db.session.add(sponsor)

        event.add_sponsor(sponsor)
        db.session.commit()

        return sponsor
