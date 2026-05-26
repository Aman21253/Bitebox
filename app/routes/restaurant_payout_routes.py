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

from app.models.restaurant_payout_model import (
    RestaurantPayout
)

router = APIRouter(
    prefix="/api/restaurant/payouts",
    tags=["Restaurant Payouts"]
)


@router.post("/request")
def create_payout_request(

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

    amount = float(
        body.get("amount", 0)
    )

    if amount <= 0:

        raise HTTPException(
            status_code=400,
            detail="Invalid payout amount"
        )

    if amount > restaurant.available_balance:

        raise HTTPException(
            status_code=400,
            detail="Insufficient balance"
        )

    payout = RestaurantPayout(

        restaurant_id=restaurant.id,

        amount=amount
    )

    restaurant.available_balance -= amount

    db.add(payout)

    db.commit()

    return {
        "message":
        "Payout request submitted"
    }


@router.get("/")
def get_payouts(

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

    payouts = db.query(
        RestaurantPayout
    ).filter(
        RestaurantPayout.restaurant_id ==
        restaurant.id
    ).order_by(
        RestaurantPayout.id.desc()
    ).all()

    return payouts