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

    print("data: ", data)

    try:
        runner = RunnerService.create_runner(data)
        return jsonify({'message': 'Runner created successfully', 'runner_id': runner.id}), 201
    except Exception as e:
        print("Error during commit:", str(e))
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
            'date': race_event.date,
            'location': race_event.location,
            'description': race_event.description
        }), 201
    except Exception as e:
        print("Error during event creation:", str(e))
        return jsonify({'error': str(e)}), 400

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
