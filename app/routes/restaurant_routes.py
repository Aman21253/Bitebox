from fastapi import APIRouter, Depends
from app.middleware.role_middleware import require_role

router = APIRouter(
    prefix="/api/restaurant",
    tags=["Restaurant"]
)


@router.get("/dashboard")
def restaurant_dashboard(
    current_user=Depends(
        require_role(["restaurant"])
    )
):

    return {
        "message": f"Welcome Restaurant Owner {current_user.name}"
    }