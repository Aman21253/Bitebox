import os
import random
from twilio.rest import Client

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER")


def generate_otp() -> str:
    return str(random.randint(100000, 999999))


def send_otp_sms(phone: str, code: str, purpose: str = "registration") -> bool:

    purpose_text = {
        "registration": "Your Bitebox verification OTP is",
        "login": "Your Bitebox login OTP is",
        "password_reset": "Your Bitebox password reset OTP is",
        "delivery": "Your Bitebox delivery OTP is",  # NEW
    }.get(purpose, "Your Bitebox OTP is")

    message_body = f"{purpose_text}: {code}. Share this with your delivery driver."

    # ── Print for dev (Twilio commented out until you go live) ────────────
    print("\n================ OTP =================")
    print(f"PHONE   : {phone}")
    print(f"OTP     : {code}")
    print(f"PURPOSE : {purpose}")
    print(f"MESSAGE : {message_body}")
    print("=====================================\n")

    return True

    # ── Uncomment below when Twilio is active ─────────────────────────────
    # try:
    #     client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    #     client.messages.create(body=message_body, from_=TWILIO_FROM_NUMBER, to=phone)
    #     return True
    # except Exception as e:
    #     print(f"[SMS ERROR] {phone}: {e}")
    #     return False