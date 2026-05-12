import os
import random
from twilio.rest import Client

# ── Load from .env ────────────────────────────────────────────────────────────
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER")  # e.g. "+1XXXXXXXXXX"


def generate_otp() -> str:
    """Returns a random 6-digit OTP code as a string."""
    return str(random.randint(100000, 999999))


def send_otp_sms(phone: str, code: str, purpose: str = "registration") -> bool:
    """
    Sends OTP via Twilio SMS.
    Returns True on success, False on failure.

    To switch to MSG91, replace this function body with MSG91's API call:
        import requests
        url = "https://api.msg91.com/api/v5/otp"
        payload = {"template_id": "...", "mobile": phone, "otp": code}
        headers = {"authkey": os.getenv("MSG91_AUTH_KEY")}
        r = requests.post(url, json=payload, headers=headers)
        return r.status_code == 200
    """
    purpose_text = {
        "registration": "Welcome to Bitebox! Your verification code is",
        "login": "Your Bitebox login OTP is",
        "password_reset": "Your Bitebox password reset code is",
    }.get(purpose, "Your Bitebox OTP is")

    message_body = f"{purpose_text}: {code}. Valid for 10 minutes. Do not share."

    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=message_body,
            from_=TWILIO_FROM_NUMBER,
            to=phone
        )
        return True
    except Exception as e:
        # Log in production with Sentry / structured logger
        print(f"[SMS ERROR] Failed to send OTP to {phone}: {e}")
        return False