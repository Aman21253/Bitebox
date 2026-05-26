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

from app.models.restaurant_model import (
    Restaurant
)

router = APIRouter(
    prefix="/api/restaurant/settings",
    tags=["Restaurant Settings"]
)


@router.get("/")
def get_restaurant_settings(

    current_user=Depends(
        require_role(["restaurant"])
    ),

    db: Session = Depends(get_db)
):

    restaurant = db.query(
        Restaurant
    ).filter(
        Restaurant.owner_id ==
        current_user.id
    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    return restaurant


@router.put("/")
def update_restaurant_settings(

    body: dict,

    current_user=Depends(
        require_role(["restaurant"])
    ),

    db: Session = Depends(get_db)
):

    restaurant = db.query(
        Restaurant
    ).filter(
        Restaurant.owner_id ==
        current_user.id
    ).first()

    if not restaurant:

        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )

    restaurant.gst_number = body.get(
        "gst_number",
        restaurant.gst_number
    )

    restaurant.fssai_number = body.get(
        "fssai_number",
        restaurant.fssai_number
    )

    restaurant.gst_certificate_url = body.get(
        "gst_certificate_url",
        restaurant.gst_certificate_url
    )

    restaurant.fssai_certificate_url = body.get(
        "fssai_certificate_url",
        restaurant.fssai_certificate_url
    )

    restaurant.pan_card_url = body.get(
        "pan_card_url",
        restaurant.pan_card_url
    )

    restaurant.cancelled_cheque_url = body.get(
        "cancelled_cheque_url",
        restaurant.cancelled_cheque_url
    )

    restaurant.bank_account_holder = body.get(
        "bank_account_holder",
        restaurant.bank_account_holder
    )

    restaurant.bank_name = body.get(
        "bank_name",
        restaurant.bank_name
    )

    restaurant.bank_account_number = body.get(
        "bank_account_number",
        restaurant.bank_account_number
    )

    restaurant.bank_ifsc = body.get(
        "bank_ifsc",
        restaurant.bank_ifsc
    )

    restaurant.upi_id = body.get(
        "upi_id",
        restaurant.upi_id
    )

    db.commit()

    return {
        "message":
        "Restaurant settings updated successfully"
    }