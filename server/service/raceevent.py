from app import db
from models.runner import Runner
from models.raceevent import RaceEvent as Model
from models.models import Location, Track
from domain.raceevent import RaceEvent
from notifications.gateway import Gateway as Notifications
from service.unitofwork import UnitOfWork

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
            with UnitOfWork(db.session) as uow:
                location_data = data['location']
                location = Location.query.filter_by(
                    city=location_data['city'], country=location_data['country']
                ).first()

                if not location:
                    location = Location(city=location_data['city'], country=location_data['country'])
                    db.session.add(location)

                track_data = data["track"]
                track = Track.query.filter_by(
                    name=track_data['name'], distance=track_data['distance']
                ).first()

                if not track:
                    track = Track(
                        name=track_data['name'],
                        distance=track_data['distance'],
                        difficulty_level=track_data['difficulty_level'],
                    )
                    db.session.add(track)

                new_event = Model(
                    name=data['name'],
                    date=data['date'],
                    distance=data['distance'],
                    location=location,
                    track=track,
                    fee=data['fee'],
                    max_participants=data['max_participants']
                )
                db.session.add(new_event)

                return new_event
        except Exception as e:
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


    @staticmethod
    def update_race_event(event_id, data):
        with UnitOfWork(db.session) as uow:
            model = Model.query.get(event_id)
            if not model:
                raise ValueError(f"Race event with ID {event_id} not found.")

            if 'name' in data:
                model.name = data['name']
            if 'date' in data:
                model.date = data['date']
            if 'distance' in data:
                model.distance = data['distance']
            if 'fee' in data:
                model.fee = data['fee']
            if 'max_participants' in data:
                model.max_participants = data['max_participants']
            if 'location' in data:
                loc_data = data['location']
                location = Location.query.filter_by(
                    city=loc_data['city'], 
                    country=loc_data['country']
                ).first()
                if not location:
                    location = Location(city=loc_data['city'], country=loc_data['country'])
                    db.session.add(location)
                model.location = location

            if 'track' in data:
                track_data = data['track']
                track = Track.query.filter_by(
                    name=track_data['name'],
                    distance=track_data['distance']
                ).first()
                if not track:
                    track = Track(
                        name=track_data['name'],
                        distance=track_data['distance'],
                        difficulty_level=track_data['difficulty_level']
                    )
                    db.session.add(track)
                model.track = track

            db.session.add(model)
            updated_race_event = RaceEvent.from_model(model)
            return updated_race_event

    @staticmethod
    def delete_race_event(event_id):
        with UnitOfWork(db.session) as uow:
            model = Model.query.get(event_id)
            if not model:
                raise ValueError(f"Race event with ID {event_id} not found.")

            db.session.delete(model)