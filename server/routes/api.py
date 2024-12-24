from flask import request, jsonify
from . import api
from service.runner import RunnerService
from service.raceevent import RaceEventService
from service.sponsor import SponsorService

@api.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@api.route('/runners', methods=['POST'])
def create_runner():
    data = request.get_json()

    try:
        runner = RunnerService.create_runner(data)
        return jsonify({'message': 'Runner created successfully', 'runner_id': runner.id}), 201
    except Exception as e:
        print("Error during commit:", str(e))
        return jsonify({'error': str(e)}), 400
    
@api.route('/runners/login', methods=['POST'])
def login_runner():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    try:
        token = RunnerService.login_runner(email, password)
        return jsonify({'access_token': token}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 401
    except Exception as e:
        print("Error during login:", str(e))
        return jsonify({'error': 'An unexpected error occurred'}), 500
    
@api.route('/runners/<int:runner_id>/make_admin', methods=['POST'])
def make_admin(runner_id):
    print("runner_id ", runner_id)

    try:
        RunnerService.make_admin(runner_id)
        return jsonify({'message': 'Runner was made admin'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    
@api.route('/runners', methods=['GET'])
def get_runners():
    try:
        runners = RunnerService.get_all_runners()
        runners_data = [
            {
                'id': runner.id,
                'name': runner.name,
                'age': runner.age,
                'category': runner.category
            }
            for runner in runners
        ]

        return jsonify(runners_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/runners/<int:runner_id>', methods=['GET'])
def get_runner_by_id(runner_id):
    try:
        runner = RunnerService.get_runner_by_id(runner_id)
        if not runner:
            return jsonify({'error': f'Runner with ID {runner_id} not found'}), 404
        
        events = [
            {
                'id': event.id,
                'name': event.name,
                'date': event.date.isoformat(),
            }
            for event in runner.events
        ]
        
        return jsonify({
            'id': runner.id,
            'name': runner.name,
            'age': runner.age,
            'category': runner.category,
            "events": events,
        }), 200
    except Exception as e:
        print(f"Error fetching runner with ID {runner_id}:", e)
        return jsonify({'error': str(e)}), 500

@api.route('/runners/<int:runner_id>', methods=['PUT'])
def update_runner(runner_id):
    data = request.get_json()
    try:
        runner = RunnerService.update_runner(runner_id, data)
        return jsonify({'message': 'Runner updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/runners/<int:runner_id>', methods=['DELETE'])
def delete_runner(runner_id):
    try:
        RunnerService.delete_runner(runner_id)
        return jsonify({'message': 'Runner deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/race_events', methods=['POST'])
def create_race_event():
    data = request.get_json()

    try:
        race_event = RaceEventService.create_race_event(data)
        return jsonify({
            'message': 'Race event created successfully',
            'event_id': race_event.id,
            'name': race_event.name,
            'date': race_event.date.isoformat(),
            'location': race_event.location if isinstance(race_event.location, str) else {
                'city': race_event.location.city,
                'country': race_event.location.country
            },
        }), 201
    except Exception as e:
        print("Error during event creation:", e)
        return jsonify({'error': str(e)}), 400


@api.route('/race_events', methods=['GET'])
def get_race_events():
    try:
        race_events = RaceEventService.get_all_race_events()
        return jsonify(race_events), 200
    except Exception as e:
        print("Error fetching race events:", e)
        return jsonify({'error': str(e)}), 500
    
@api.route('/race_events/<int:event_id>', methods=['GET'])
def get_race_event_by_id(event_id):
    try:
        race_event = RaceEventService.get_event_by_id(event_id)
        if not race_event:
            return jsonify({'error': f'Race event with ID {event_id} not found'}), 404

        return race_event, 200
    except Exception as e:
        print(f"Error fetching race event with ID {event_id}:", e)
        return jsonify({'error': str(e)}), 500


@api.route('/race_events/<int:event_id>/register_runner', methods=['POST'])
def register_runner_for_event(event_id):
    data = request.get_json()
    try:
        RaceEventService.add_runner_to_event(event_id, data['runner_id'])
        return jsonify({'message': 'Runner registered for race event successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/sponsors', methods=['POST'])
def create_sponsor():
    data = request.get_json()
    try:
        sponsor = SponsorService.create_sponsor(data)
        return jsonify({
            'message': 'Sponsor created successfully',
            'sponsor_id': sponsor.id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/race_events/<int:event_id>/add_sponsor', methods=['POST'])
def add_sponsor_to_event(event_id):
    data = request.get_json()
    try:
        sponsor = SponsorService.add_sponsor_to_event(event_id, data)
        return jsonify({'message': 'Sponsor added successfully', 'sponsor_id': sponsor.id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/race_events/<int:event_id>', methods=['PUT'])
def update_race_event(event_id):
    data = request.get_json()
    try:
        updated_event = RaceEventService.update_race_event(event_id, data)
        return jsonify({
            'message': 'Race event updated successfully',
            'event': updated_event
        }), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@api.route('/race_events/<int:event_id>', methods=['DELETE'])
def delete_race_event(event_id):
    try:
        RaceEventService.delete_race_event(event_id)
        return jsonify({'message': 'Race event deleted successfully'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400