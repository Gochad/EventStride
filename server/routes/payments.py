from flask import Blueprint, jsonify, request
import stripe
from . import checkout_bp

@checkout_bp.route('/create-payment-link', methods=['POST'])
def create_payment_link():
    data = request.get_json()
    success_url = data.get('success_url')
    cancel_url = data.get('cancel_url')
    amount = data.get('unit_amount')
    runner_name = data.get('runner_name', 'Runner')
    event_name = data.get('event_name', 'Race Event')

    try:
        price = stripe.Price.create(
            unit_amount=amount,
            currency='pln',
            product_data={
                'name': f'Entry Fee for {event_name} - {runner_name}',
            },
        )

        payment_link = stripe.PaymentLink.create(
            line_items=[{
                'price': price.id,
                'quantity': 1,
            }],
            # after_completion={
            #     'type': 'redirect',
            #     'redirect': {
            #         'url': success_url,
            #     },
            # }
        )
        return jsonify({'url': payment_link.url})
    except Exception as e:
        return jsonify(error=str(e)), 500
