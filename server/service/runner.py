from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token

from app import db
from models.runner import Runner as Model
from domain.runner import Runner
from notifications.gateway import Gateway as Notifications

class RunnerService:
    @staticmethod
    def get_runner_by_id(runner_id):
        model = Model.query.get(runner_id)
        if not model:
            raise ValueError("Runner not found")
        return Runner.from_model(model)

    @staticmethod
    def create_runner(data):
        if Model.query.filter_by(email=data["email"]).first():
            raise ValueError("Email already registered")
        
        password_hash = generate_password_hash(data["password"])

        new_runner = Model(
            name=data['name'],
            age=data['age'],
            number=data['number'],
            email=data['email'],
            category=data['category'],
            password_hash=password_hash
        )
        
        db.session.add(new_runner)
        db.session.commit()

        Notifications.send_email_notification("new account", new_runner.email)

        return Runner.from_model(new_runner)

    @staticmethod
    def make_admin(runner_id):
        runner = Model.query.get_or_404(runner_id)
        runner.is_admin = True
        db.session.commit()

    @staticmethod
    def update_runner(runner_id, data):
        runner = Model.query.get_or_404(runner_id)
        runner.name = data.get('name', runner.name)
        runner.age = data.get('age', runner.age)
        runner.category = data.get('category', runner.category)
        db.session.commit()
        return Runner.from_model(runner)

    @staticmethod
    def delete_runner(runner_id):
        runner = Model.query.get_or_404(runner_id)
        db.session.delete(runner)
        db.session.commit()
    
    @staticmethod
    def get_all_runners():
        models = Model.query.all()
        return [Runner.from_model(model) for model in models]
    
    @staticmethod
    def login_runner(email, password):
        runner = Model.query.filter_by(email=email).first()
        if not runner or not check_password_hash(runner.password_hash, password):
            raise ValueError("Invalid email or password")

        access_token = create_access_token(identity={'id': runner.id, 'email': runner.email, 'role': 'runner'})
        return access_token
