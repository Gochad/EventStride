from app import db
from models.runner import Runner
from models.raceevent import RaceEvent as Model
from domain.raceevent import RaceEvent
from notifications.gateway import Gateway as Notifications

class RaceEventService:
    @staticmethod
    def get_event_by_id(event_id):
        model = Model.query.get(event_id)
        if not model:
            raise ValueError("Race event not found")
        return RaceEvent.from_model(model)

    @staticmethod
    def create_race_event(data):
        new_event = Model(
            name=data['name'],
            date=data['date'],
            distance=data['distance'],
            location=data['location'],
            track=data['track']
        )
        db.session.add(new_event)
        db.session.commit()
        return RaceEvent.from_model(new_event)

    @staticmethod
    def add_runner_to_event(event_id, runner_id):
        event = Model.query.get_or_404(event_id)
        runner = db.session.query(Runner).get(runner_id)
        if runner not in event.runners:
            event.runners.append(runner)
        db.session.commit()
        return event

    @staticmethod
    def add_sponsor_to_event(event_id, sponsor):
        event = Model.query.get_or_404(event_id)
        if sponsor not in event.sponsors:
            event.sponsors.append(sponsor)
        db.session.commit()
        return event

    @staticmethod
    def notify_runners(event_id, message):
        event = Model.query.get_or_404(event_id)
        for runner in event.runners:
            Notifications.send_email_notification(message, runner)