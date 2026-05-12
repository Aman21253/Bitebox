from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError

from app.database.db import get_db
from app.models.user_model import User
from app.utils.jwt import decode_token

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Validates the Bearer access token and returns the authenticated User.
    Use as a FastAPI dependency on any protected route.
    """
    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)

        # Reject refresh tokens used as access tokens
        if payload.get("type") != "access":
            raise credentials_exception

        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or banned",
        )

    return user


def require_role(*roles: str):
    """
    RBAC dependency factory.

    Usage:
        @router.get("/admin-only")
        def admin_route(user: User = Depends(require_role("admin"))):
            ...

        @router.get("/restaurant-or-admin")
        def shared_route(user: User = Depends(require_role("admin", "restaurant"))):
            ...
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role.value not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role(s): {', '.join(roles)}",
            )
        return current_user

    return role_checker