class NotificationGateway:
    @staticmethod
    def send_email_notification(message, runner):
        print(f"Email to {runner.email}: {message}")

    @staticmethod
    def send_sms_notification(message, runner):
        print(f"SMS to {runner.phone}: {message}")
