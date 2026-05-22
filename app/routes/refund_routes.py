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

from app.models.order_model import Order

from app.models.refund_model import Refund

from app.schemas.refund_schema import (
    CreateRefundRequest,
    UpdateRefundRequest
)

router = APIRouter(
    prefix="/api/refunds",
    tags=["Refunds"]
)

# ─────────────────────────────────────────────
# CREATE REFUND REQUEST
# ─────────────────────────────────────────────

@router.post("/{order_id}/request")
def create_refund_request(

    order_id: int,

    body: CreateRefundRequest,

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)

):

    order = db.query(Order).filter(

        Order.id == order_id,

        Order.customer_id ==
        current_user.id

    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    existing_refund = db.query(
        Refund
    ).filter(
        Refund.order_id == order.id
    ).first()

    if existing_refund:

        raise HTTPException(
            status_code=400,
            detail="Refund already requested"
        )

    refund = Refund(

        order_id=order.id,

        customer_id=current_user.id,

        refund_reason=
        body.refund_reason,

        refund_type=
        body.refund_type,

        refund_amount=
        body.refund_amount,

        refund_status="pending"

    )

    db.add(refund)

    order.refund_status = (
        "requested"
    )

    db.commit()

    return {
        "message":
        "Refund request submitted"
    }

# ─────────────────────────────────────────────
# GET MY REFUNDS
# ─────────────────────────────────────────────

@router.get("/my-refunds")
def get_my_refunds(

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)

):

    refunds = db.query(
        Refund
    ).filter(
        Refund.customer_id ==
        current_user.id
    ).all()

    return refunds

# ─────────────────────────────────────────────
# GET ALL REFUNDS (ADMIN)
# ─────────────────────────────────────────────

@router.get("/admin/all")
def get_all_refunds(

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)

):

    refunds = db.query(
        Refund
    ).all()

    return refunds

# ─────────────────────────────────────────────
# APPROVE / REJECT REFUND
# ─────────────────────────────────────────────

@router.put("/{refund_id}/update")
def update_refund_status(

    refund_id: int,

    body: UpdateRefundRequest,

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)

):

    refund = db.query(
        Refund
    ).filter(
        Refund.id == refund_id
    ).first()

    if not refund:

        raise HTTPException(
            status_code=404,
            detail="Refund not found"
        )

    refund.refund_status = (
        body.refund_status
    )

    refund.admin_note = (
        body.admin_note
    )

    # PAYMENT REVERSAL

    if body.refund_status == "approved":

        refund.payment_reversal_status = (
            "processed"
        )

        refund.order.refund_status = (
            "approved"
        )

    elif body.refund_status == "rejected":

        refund.payment_reversal_status = (
            "cancelled"
        )

        refund.order.refund_status = (
            "rejected"
        )

    db.commit()

    return {
        "message":
        "Refund updated successfully"
    }
