from fastapi import APIRouter, Depends
from app.middleware.role_middleware import require_role

router = APIRouter(
    prefix="/api/driver",
    tags=["Driver"]
)

@router.get("/dashboard")
def driver_dashboard(
    current_user=Depends(
        require_role(["driver"])
    )
):
    return {
        "message": f"Welcome Driver {current_user.name}"
    }