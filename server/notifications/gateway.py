import smtplib
from twilio.rest import Client
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class NotificationGateway:
    EMAIL_HOST = "smtp.gmail.com"
    EMAIL_PORT = 587
    EMAIL_USERNAME = "your_email@example.com"
    EMAIL_PASSWORD = "your_email_password"

    TWILIO_ACCOUNT_SID = "your_twilio_account_sid"
    TWILIO_AUTH_TOKEN = "your_twilio_auth_token"
    TWILIO_PHONE_NUMBER = "+1234567890"

    @staticmethod
    def send_email_notification(message, runner):
        try:
            email_msg = MIMEMultipart()
            email_msg["From"] = NotificationGateway.EMAIL_USERNAME
            email_msg["To"] = runner.email
            email_msg["Subject"] = "Notification"
            email_msg.attach(MIMEText(message, "plain"))

            with smtplib.SMTP(NotificationGateway.EMAIL_HOST, NotificationGateway.EMAIL_PORT) as server:
                server.starttls()
                server.login(NotificationGateway.EMAIL_USERNAME, NotificationGateway.EMAIL_PASSWORD)
                server.send_message(email_msg)

            print(f"Email sent to {runner.email}")
        except Exception as e:
            print(f"Failed to send email to {runner.email}: {str(e)}")

    @staticmethod
    def send_sms_notification(message, runner):
        try:
            client = Client(NotificationGateway.TWILIO_ACCOUNT_SID, NotificationGateway.TWILIO_AUTH_TOKEN)

            client.messages.create(
                body=message,
                from_=NotificationGateway.TWILIO_PHONE_NUMBER,
                to=runner.phone
            )

            print(f"SMS sent to {runner.phone}")
        except Exception as e:
            print(f"Failed to send SMS to {runner.phone}: {str(e)}")
