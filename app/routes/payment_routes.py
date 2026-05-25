from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.role_middleware import (
    require_role
)

from app.models.cart_model import Cart

from app.utils.razorpay_client import (
    client
)

import os
import hmac
import hashlib

router = APIRouter(
    prefix="/api/payments",
    tags=["Payments"]
)


# CREATE PAYMENT ORDER

@router.post("/create-order")
def create_payment_order(

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)

):

    cart = db.query(Cart).filter(
        Cart.customer_id ==
        current_user.id
    ).first()

    if not cart:

        raise HTTPException(
            status_code=404,
            detail="Cart not found"
        )

    amount = int(
        float(cart.total_amount) * 100
    )

    razorpay_order = client.order.create({

        "amount": amount,

        "currency": "INR",

        "payment_capture": 1

    })

    return {

        "razorpay_order_id":
        razorpay_order["id"],

        "amount":
        razorpay_order["amount"],

        "key":
        os.getenv(
            "RAZORPAY_KEY_ID"
        )

    }


# VERIFY PAYMENT

@router.post("/verify")
def verify_payment(body: dict):

    razorpay_order_id = body.get(
        "razorpay_order_id"
    )

    razorpay_payment_id = body.get(
        "razorpay_payment_id"
    )

    razorpay_signature = body.get(
        "razorpay_signature"
    )

    # VALIDATION

    if (
        not razorpay_order_id or
        not razorpay_payment_id or
        not razorpay_signature
    ):

        raise HTTPException(
            status_code=400,
            detail="Missing payment credentials"
        )

    generated_signature = hmac.new(

        os.getenv(
            "RAZORPAY_KEY_SECRET"
        ).encode(),

        f"{razorpay_order_id}|{razorpay_payment_id}".encode(),

        hashlib.sha256

    ).hexdigest()

    print(
        "GENERATED:",
        generated_signature
    )

    print(
        "RECEIVED:",
        razorpay_signature
    )

    if generated_signature != razorpay_signature:

        raise HTTPException(
            status_code=400,
            detail="Payment verification failed"
        )

    return {
        "message": "Payment verified"
    }