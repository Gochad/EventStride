from flask import Blueprint, jsonify, request
import stripe
from . import checkout_bp

@checkout_bp.route('/create-payment-link', methods=['POST'])
def create_payment_link():
    price = stripe.Price.create(
        unit_amount=200,
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
            }]
        )
        return jsonify({'url': payment_link.url})
    except Exception as e:
        return jsonify(error=str(e)), 500
