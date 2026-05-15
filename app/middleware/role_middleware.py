from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.middleware.auth_middleware import get_current_user

from app.models.permission_model import Permission
from app.models.role_permission_model import RolePermission


# ─────────────────────────────────────────────────────────────
# Role Middleware
# ─────────────────────────────────────────────────────────────

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


# ─────────────────────────────────────────────────────────────
# Permission Middleware
# ─────────────────────────────────────────────────────────────

def require_permission(permission_name: str):

    def permission_checker(
        current_user=Depends(get_current_user),
        db: Session = Depends(get_db)
    ):

        # Super admin bypass
        if current_user.role.value == "admin":
            return current_user

        permission = db.query(Permission).filter(
            Permission.name == permission_name
        ).first()

        if not permission:
            raise HTTPException(
                status_code=404,
                detail="Permission not found"
            )

        role_permission = db.query(RolePermission).filter(
            RolePermission.role == current_user.role.value,
            RolePermission.permission_id == permission.id
        ).first()

        if not role_permission:
            raise HTTPException(
                status_code=403,
                detail="Permission denied"
            )

        return current_user

    return permission_checker