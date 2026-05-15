from fastapi import APIRouter, Depends
from app.middleware.auth_middleware import get_current_user

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role.value
    }