from flask import Blueprint, request, jsonify
from models import db, Runner, RaceEvent, Track, Sponsor, Result, Location
from datetime import datetime

api = Blueprint('api', __name__)

@api.route('/runners', methods=['POST'])
def create_runner():
    data = request.get_json()
    try:
        new_runner = Runner(
            name=data['name'],
            age=data['age'],
            category=data['category']
        )
        db.session.add(new_runner)
        db.session.commit()
        return jsonify({'message': 'Runner created successfully', 'runner_id': new_runner.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/runners/<int:runner_id>', methods=['GET'])
def get_runner(runner_id):
    runner = Runner.query.get_or_404(runner_id)
    runner_data = {
        'id': runner.id,
        'name': runner.name,
        'age': runner.age,
        'category': runner.category
    }
    return jsonify(runner_data), 200

@api.route('/runners/<int:runner_id>', methods=['PUT'])
def update_runner(runner_id):
    runner = Runner.query.get_or_404(runner_id)
    data = request.get_json()
    try:
        runner.name = data.get('name', runner.name)
        runner.age = data.get('age', runner.age)
        runner.category = data.get('category', runner.category)
        db.session.commit()
        return jsonify({'message': 'Runner updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/runners/<int:runner_id>', methods=['DELETE'])
def delete_runner(runner_id):
    runner = Runner.query.get_or_404(runner_id)
    db.session.delete(runner)
    db.session.commit()
    return jsonify({'message': 'Runner deleted successfully'}), 200

@api.route('/race_events', methods=['POST'])
def create_race_event():
    data = request.get_json()
    try:
        date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        
        location_data = data['location']
        location = Location.query.filter_by(
            city=location_data['city'],
            country=location_data['country']
        ).first()
        if not location:
            location = Location(
                city=location_data['city'],
                country=location_data['country']
            )
            db.session.add(location)
            db.session.commit()
        
        track_data = data['track']
        track = Track.query.filter_by(
            name=track_data['name']
        ).first()
        if not track:
            track = Track(
                name=track_data['name'],
                distance=track_data['distance'],
                difficulty_level=track_data['difficulty_level']
            )
            db.session.add(track)
            db.session.commit()
        
        new_race_event = RaceEvent(
            name=data['name'],
            date=date,
            distance=data['distance'],
            location=location,
            track=track
        )
        db.session.add(new_race_event)
        db.session.commit()
        return jsonify({'message': 'Race event created successfully', 'race_event_id': new_race_event.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/race_events/<int:event_id>', methods=['GET'])
def get_race_event(event_id):
    event = RaceEvent.query.get_or_404(event_id)
    event_data = {
        'id': event.id,
        'name': event.name,
        'date': event.date.strftime('%Y-%m-%d'),
        'distance': event.distance,
        'location': {
            'city': event.location.city,
            'country': event.location.country
        },
        'track': {
            'name': event.track.name,
            'distance': event.track.distance,
            'difficulty_level': event.track.difficulty_level
        }
    }
    return jsonify(event_data), 200

@api.route('/race_events/<int:event_id>/register_runner', methods=['POST'])
def register_runner_for_event(event_id):
    race_event = RaceEvent.query.get_or_404(event_id)
    data = request.get_json()
    runner = Runner.query.get_or_404(data['runner_id'])
    try:
        race_event.add_runner(runner)
        db.session.commit()
        return jsonify({'message': 'Runner registered for race event successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@api.route('/race_events/<int:event_id>/results', methods=['POST'])
def record_result(event_id):
    race_event = RaceEvent.query.get_or_404(event_id)
    data = request.get_json()
    runner = Runner.query.get_or_404(data['runner_id'])
    try:
        finish_time = datetime.strptime(data['finish_time'], '%H:%M:%S').time()
        new_result = Result(
            position=data['position'],
            finish_time=finish_time,
            runner=runner,
            race_event=race_event
        )
        db.session.add(new_result)
        db.session.commit()
        return jsonify({'message': 'Result recorded successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/race_events/<int:event_id>/results', methods=['GET'])
def get_event_results(event_id):
    race_event = RaceEvent.query.get_or_404(event_id)
    results = Result.query.filter_by(race_event_id=event_id).order_by(Result.position).all()
    results_data = []
    for result in results:
        results_data.append({
            'runner_id': result.runner.id,
            'runner_name': result.runner.name,
            'position': result.position,
            'finish_time': result.finish_time.strftime('%H:%M:%S')
        })
    return jsonify({'race_event': race_event.name, 'results': results_data}), 200

@api.route('/race_events/<int:event_id>/add_sponsor', methods=['POST'])
def add_sponsor_to_event(event_id):
    race_event = RaceEvent.query.get_or_404(event_id)
    data = request.get_json()
    try:
        sponsor = Sponsor.query.filter_by(name=data['name']).first()
        if not sponsor:
            sponsor = Sponsor(
                name=data['name'],
                logo=data.get('logo'),
                type=data['type']
            )
            db.session.add(sponsor)
            db.session.commit()
        race_event.sponsors.append(sponsor)
        db.session.commit()
        return jsonify({'message': 'Sponsor added to race event successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
