from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from datetime import datetime

from app.database.db import get_db

from app.middleware.role_middleware import (
    require_role
)

from app.models.coupon_model import Coupon

from app.models.coupon_usage_model import (
    CouponUsage
)

from app.models.order_model import Order

from app.schemas.coupon_schema import (
    CreateCouponRequest,
    ApplyCouponRequest
)

router = APIRouter(
    prefix="/api/coupons",
    tags=["Coupons"]
)


# CREATE COUPON

@router.post("/create")
def create_coupon(

    body: CreateCouponRequest,

    current_user=Depends(
        require_role(["admin"])
    ),

    db: Session = Depends(get_db)
):

    existing_coupon = db.query(
        Coupon
    ).filter(
        Coupon.code == body.code
    ).first()

    if existing_coupon:

        raise HTTPException(
            status_code=400,
            detail="Coupon already exists"
        )

    coupon = Coupon(

        code=body.code.upper(),

        description=body.description,

        discount_type=body.discount_type,

        discount_value=body.discount_value,

        minimum_order_amount=
        body.minimum_order_amount,

        maximum_discount_amount=
        body.maximum_discount_amount,

        usage_limit=body.usage_limit,

        first_order_only=
        body.first_order_only,

        expiry_date=body.expiry_date
    )

    db.add(coupon)

    db.commit()

    return {
        "message": "Coupon created successfully"
    }


# APPLY COUPON

@router.post("/apply")
def apply_coupon(

    body: ApplyCouponRequest,

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)
):

    coupon = db.query(Coupon).filter(

        Coupon.code == body.code.upper(),

        Coupon.is_active == True

    ).first()

    if not coupon:

        raise HTTPException(
            status_code=404,
            detail="Invalid coupon"
        )

    # EXPIRY CHECK

    if (
        coupon.expiry_date and
        coupon.expiry_date < datetime.utcnow()
    ):

        raise HTTPException(
            status_code=400,
            detail="Coupon expired"
        )

    # USAGE LIMIT

    if coupon.used_count >= coupon.usage_limit:

        raise HTTPException(
            status_code=400,
            detail="Coupon usage limit exceeded"
        )

    # MIN ORDER CHECK

    if (
        body.order_amount <
        coupon.minimum_order_amount
    ):

        raise HTTPException(
            status_code=400,
            detail=f"Minimum order should be ₹{coupon.minimum_order_amount}"
        )

    # FIRST ORDER CHECK

    if coupon.first_order_only:

        existing_order = db.query(
            Order
        ).filter(
            Order.customer_id == current_user.id
        ).first()

        if existing_order:

            raise HTTPException(
                status_code=400,
                detail="Coupon valid only for first order"
            )

    # CALCULATE DISCOUNT

    discount_amount = 0

    if coupon.discount_type == "percentage":

        discount_amount = (
            body.order_amount *
            coupon.discount_value
        ) / 100

    else:

        discount_amount = (
            coupon.discount_value
        )

    # MAX DISCOUNT CHECK

    if (
        coupon.maximum_discount_amount > 0 and
        discount_amount >
        coupon.maximum_discount_amount
    ):

        discount_amount = (
            coupon.maximum_discount_amount
        )

    final_amount = (
        body.order_amount -
        discount_amount
    )

    return {

        "coupon_code":
        coupon.code,

        "discount_amount":
        round(discount_amount, 2),

        "final_amount":
        round(final_amount, 2),

        "message":
        "Coupon applied successfully"
    }


# GET ALL COUPONS

@router.get("/")
def get_all_coupons(

    db: Session = Depends(get_db)
):
    coupons = db.query(
        Coupon
    ).all()
    return coupons