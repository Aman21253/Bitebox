from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from sqlalchemy import func

from app.database.db import get_db

from app.middleware.role_middleware import (
    require_role
)

from app.models.review_model import Review

from app.models.order_model import Order

from app.models.restaurant_model import (
    Restaurant
)

from app.models.driver_model import (
    Driver
)

from app.models.menu_item_model import (
    MenuItem
)

from app.schemas.review_schema import (
    CreateReviewRequest
)

router = APIRouter(
    prefix="/api/reviews",
    tags=["Reviews"]
)


# ─────────────────────────────────────────────
# CREATE REVIEW
# ─────────────────────────────────────────────

@router.post("/")
def create_review(

    body: CreateReviewRequest,

    current_user=Depends(
        require_role(["customer"])
    ),

    db: Session = Depends(get_db)
):

    # VERIFY ORDER

    order = db.query(Order).filter(

        Order.id == body.order_id,

        Order.customer_id == current_user.id

    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # ONLY DELIVERED ORDERS

    if order.delivery_status != "delivered":

        raise HTTPException(
            status_code=400,
            detail="Only delivered orders can be reviewed"
        )

    # PREVENT DUPLICATE REVIEW

    existing_review = db.query(Review).filter(

        Review.order_id == body.order_id,

        Review.customer_id == current_user.id

    ).first()

    if existing_review:

        raise HTTPException(
            status_code=400,
            detail="Review already submitted"
        )

    # CREATE REVIEW

    new_review = Review(

        order_id=body.order_id,

        customer_id=current_user.id,

        restaurant_id=body.restaurant_id,

        driver_id=body.driver_id,

        menu_item_id=body.menu_item_id,

        rating=body.rating,

        review_text=body.review_text,

        image_url=body.image_url,

        status="approved"
    )

    db.add(new_review)

    db.commit()

    db.refresh(new_review)

    # ─────────────────────────────────────
    # UPDATE RESTAURANT RATING
    # ─────────────────────────────────────

    if body.restaurant_id:

        avg_rating = db.query(
            func.avg(Review.rating)
        ).filter(

            Review.restaurant_id ==
            body.restaurant_id,

            Review.status == "approved"

        ).scalar()

        total_reviews = db.query(
            Review
        ).filter(

            Review.restaurant_id ==
            body.restaurant_id,

            Review.status == "approved"

        ).count()

        restaurant = db.query(
            Restaurant
        ).filter(
            Restaurant.id ==
            body.restaurant_id
        ).first()

        if restaurant:

            restaurant.average_rating = round(
                float(avg_rating or 0),
                1
            )

            restaurant.total_reviews = (
                total_reviews
            )

    # ─────────────────────────────────────
    # UPDATE DRIVER RATING
    # ─────────────────────────────────────

    if body.driver_id:

        avg_rating = db.query(
            func.avg(Review.rating)
        ).filter(

            Review.driver_id ==
            body.driver_id,

            Review.status == "approved"

        ).scalar()

        total_reviews = db.query(
            Review
        ).filter(

            Review.driver_id ==
            body.driver_id,

            Review.status == "approved"

        ).count()

        driver = db.query(
            Driver
        ).filter(
            Driver.id ==
            body.driver_id
        ).first()

        if driver:

            driver.average_rating = round(
                float(avg_rating or 0),
                1
            )

            driver.total_reviews = (
                total_reviews
            )

    # ─────────────────────────────────────
    # UPDATE MENU ITEM RATING
    # ─────────────────────────────────────

    if body.menu_item_id:

        avg_rating = db.query(
            func.avg(Review.rating)
        ).filter(

            Review.menu_item_id ==
            body.menu_item_id,

            Review.status == "approved"

        ).scalar()

        total_reviews = db.query(
            Review
        ).filter(

            Review.menu_item_id ==
            body.menu_item_id,

            Review.status == "approved"

        ).count()

        menu_item = db.query(
            MenuItem
        ).filter(
            MenuItem.id ==
            body.menu_item_id
        ).first()

        if menu_item:

            menu_item.average_rating = round(
                float(avg_rating or 0),
                1
            )

            menu_item.total_reviews = (
                total_reviews
            )

    db.commit()

    return {

        "message":
        "Review submitted successfully",

        "review_id":
        new_review.id
    }


# ─────────────────────────────────────────────
# GET RESTAURANT REVIEWS
# ─────────────────────────────────────────────

@router.get("/restaurant/{restaurant_id}")
def get_restaurant_reviews(

    restaurant_id: int,

    db: Session = Depends(get_db)
):

    reviews = db.query(Review).filter(

        Review.restaurant_id ==
        restaurant_id,

        Review.status == "approved"

    ).order_by(
        Review.id.desc()
    ).all()

    return reviews


# ─────────────────────────────────────────────
# GET DRIVER REVIEWS
# ─────────────────────────────────────────────

@router.get("/driver/{driver_id}")
def get_driver_reviews(

    driver_id: int,

    db: Session = Depends(get_db)
):

    reviews = db.query(Review).filter(

        Review.driver_id ==
        driver_id,

        Review.status == "approved"

    ).order_by(
        Review.id.desc()
    ).all()

    return reviews


# ─────────────────────────────────────────────
# GET MENU ITEM REVIEWS
# ─────────────────────────────────────────────

@router.get("/menu-item/{menu_item_id}")
def get_menu_item_reviews(

    menu_item_id: int,

    db: Session = Depends(get_db)
):

    reviews = db.query(Review).filter(

        Review.menu_item_id ==
        menu_item_id,

        Review.status == "approved"

    ).order_by(
        Review.id.desc()
    ).all()

    return reviews