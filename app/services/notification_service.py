from sqlalchemy.orm import Session

from app.models.notification_model import (
    Notification
)

from app.websockets.connection_manager import (
    manager
)


async def create_notification(

    db: Session,

    user_id: int,

    title: str,

    message: str,

    notification_type="general"

):

    notification = Notification(

        user_id=user_id,

        title=title,

        message=message,

        type=notification_type
    )

    db.add(notification)

    db.commit()

    db.refresh(notification)

    # REALTIME EVENT

    await manager.broadcast({

        "type": "notification",

        "user_id": user_id,

        "title": title,

        "message": message,

        "notification_type":
        notification_type
    })

    return notification