from app import db
from service.unitofwork import UnitOfWork
from models.models import Payment
import stripe

class PaymentService:
    @staticmethod
    def create_payment(runner_id, event_id, amount):
        with UnitOfWork(db.session) as uow:
            payment = Payment(
                runner_id=runner_id,
                event_id=event_id,
                amount=amount,
                status="Pending"
            )
            db.session.add(payment)
            return payment

    @staticmethod
    def create_payment_link(data):
        runner_id = data.get('runner_id')
        event_id = data.get('event_id')
        amount = data.get('unit_amount')
        runner_name = data.get('runner_name', 'Runner')
        event_name = data.get('event_name', 'Race Event')
        success_url = data.get('success_url')
        cancel_url = data.get('cancel_url')

        print("data: ", data)

        if not runner_id or not event_id:
            raise ValueError("runner_id and event_id are required to create a payment.")

        payment = PaymentService.create_payment(runner_id, event_id, amount)

        try:
            price = stripe.Price.create(
                unit_amount=200,
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
                after_completion={
                    "type": "redirect",
                    "redirect": {
                        "url": success_url
                    }
                }
            )

            return {
                'url': payment_link.url,
                'payment_id': payment.id 
            }
        
        except Exception as e:
            with UnitOfWork(db.session) as uow:
                payment.status = "Failed"
                db.session.add(payment)
            raise e

    @staticmethod
    def get_payment_by_id(payment_id):
        payment = Payment.query.get(payment_id)
        if not payment:
            raise ValueError(f"Payment with ID {payment_id} not found.")
        return payment
    
    @staticmethod
    def get_payments_for_runner(runner_id):
        return Payment.query.filter_by(runner_id=runner_id).all()

