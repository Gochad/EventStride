import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

class Gateway:
    EMAIL_HOST = os.getenv("EMAIL_HOST")
    EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
    EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

    @staticmethod
    def send_email_notification(message, email):
        try:
            email_msg = MIMEMultipart()
            email_msg["From"] = Gateway.EMAIL_USERNAME
            email_msg["To"] = email
            email_msg["Subject"] = "Notification"
            email_msg.attach(MIMEText(message, "plain"))

            with smtplib.SMTP(Gateway.EMAIL_HOST, Gateway.EMAIL_PORT) as server:
                server.starttls()
                server.login(Gateway.EMAIL_USERNAME, Gateway.EMAIL_PASSWORD)
                server.send_message(email_msg)

            print(f"Email sent to {email}")
        except Exception as e:
            print(f"Failed to send email to {email}: {str(e)}")
