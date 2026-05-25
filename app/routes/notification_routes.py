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

from app.models.notification_model import (
    Notification
)

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"]
)


# ─────────────────────────────────────────────
# GET MY NOTIFICATIONS
# ─────────────────────────────────────────────

@router.get("/")
def get_notifications(

    current_user=Depends(
        require_role([
            "customer",
            "restaurant",
            "driver",
            "admin"
        ])
    ),

    db: Session = Depends(get_db)

):

    notifications = db.query(
        Notification
    ).filter(
        Notification.user_id ==
        current_user.id
    ).order_by(
        Notification.id.desc()
    ).all()

    return notifications


# ─────────────────────────────────────────────
# MARK AS READ
# ─────────────────────────────────────────────

@router.put("/{notification_id}/read")
def mark_notification_read(

    notification_id: int,

    current_user=Depends(
        require_role([
            "customer",
            "restaurant",
            "driver",
            "admin"
        ])
    ),

    db: Session = Depends(get_db)

):

    notification = db.query(
        Notification
    ).filter(

        Notification.id ==
        notification_id,

        Notification.user_id ==
        current_user.id

    ).first()

    if not notification:

        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.is_read = True

    db.commit()

    return {
        "message":
        "Notification marked as read"
    }