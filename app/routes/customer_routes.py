from fastapi import APIRouter, Depends
from app.middleware.role_middleware import require_role

router = APIRouter(
    prefix="/api/customer",
    tags=["Customer"]
)


@router.get("/dashboard")
def customer_dashboard(
    current_user=Depends(
        require_role(["customer"])
    )
):

    return {
        "message": f"Welcome Customer {current_user.name}"
    }