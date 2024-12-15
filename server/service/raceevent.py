from app import db
from models.runner import Runner
from models.raceevent import RaceEvent as Model
from models.models import Location
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
        try:
            location_data = data['location']
            location = Location.query.filter_by(
                city=location_data['city'], country=location_data['country']
            ).first()

            if not location:
                location = Location(city=location_data['city'], country=location_data['country'])
                db.session.add(location)

            new_event = Model(
                name=data['name'],
                date=data['date'],
                distance=data['distance'],
                location=location,
            )
            db.session.add(new_event)
            db.session.commit()
            return new_event
        except Exception as e:
            db.session.rollback()
            raise e
        
    @staticmethod
    def get_all_race_events():
        models = Model.query.all()
        return [RaceEvent.from_model(model) for model in models]

    @staticmethod
    def add_runner_to_event(event_id, runner_id):
        event = Model.query.get_or_404(event_id)
        runner = db.session.query(Runner).get(runner_id)
        if runner not in event.runners:
            event.runners.append(runner)
        db.session.commit()
        return event


        if event and len(event.participants) < event.max_participants:
            payment = Payment(
                runner_id=runner_id,
                event_id=event_id,
                amount=event.fee,
                status="Pending"
            )
            db.session.add(payment)
            db.session.commit()
            return payment
        else:
            return {"error": "Event is full or doesn't exist"}

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
        
    @staticmethod
    def get_runners_for_event(event_id):
        event = Model.query.get_or_404(event_id)
        return [
            {"id": runner.id, "name": runner.name, "age": runner.age, "category": runner.category}
            for runner in event.runners
        ]