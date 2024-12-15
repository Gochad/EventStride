from flask import Blueprint, jsonify, request
import stripe
from . import checkout_bp

@checkout_bp.route('/create-payment-link', methods=['POST'])
def create_payment_link():
    data = request.get_json()
    success_url = data.get('success_url')
    cancel_url = data.get('cancel_url')
    amount = data.get('unit_amount')

    price = stripe.Price.create(
        unit_amount=amount,
        currency='pln',
        product_data={
            'name': 'Entry Fee for Race Event',
        },
    )
    try:
        payment_link = stripe.PaymentLink.create(
            line_items=[{
                'price': price.id,
                'quantity': 1,
            }],
            success_url=success_url,
            cancel_url=cancel_url,
        )
        return jsonify({'url': payment_link.url})
    except Exception as e:
        return jsonify(error=str(e)), 500
