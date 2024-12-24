from flask import jsonify, request
from . import checkout_bp
import stripe
from service.payment import PaymentService

@checkout_bp.route('/create-payment-link', methods=['POST'])
def create_payment_link():
    data = request.get_json()

    try:
        result = PaymentService.create_payment_link(data)
        return jsonify(result), 200
    except Exception as e:
        print("cos sie wyjebało: ", e)
        return jsonify(error=str(e)), 500


@checkout_bp.route('/payments/runner/<int:runner_id>', methods=['GET'])
def get_payments_for_runner(runner_id):
    try:
        payments = PaymentService.get_payments_for_runner(runner_id)
        payments_data = []
        for payment in payments:
            payments_data.append({
                'id': payment.id,
                'runner_id': payment.runner_id,
                'event_id': payment.event_id,
                'amount': payment.amount,
                'status': payment.status
            })

        return jsonify(payments_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
