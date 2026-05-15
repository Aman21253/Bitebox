from fastapi import HTTPException, Depends
from app.middleware.auth_middleware import get_current_user


def require_role(allowed_roles: list):

    def role_checker(current_user=Depends(get_current_user)):
        user_role = current_user.role.value
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )
        return current_user

    return role_checker