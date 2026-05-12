from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import JWTError
from pydantic import BaseModel

from app.database.db import get_db
from app.models.user_model import User
from app.schemas.user_schema import UserRegister, UserLogin
from app.utils.hash import hash_password, verify_password
from app.utils.jwt import create_access_token, create_refresh_token, decode_token
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


class TokenRefreshRequest(BaseModel):
    refresh_token: str


@router.post("/register")
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, existing_user.password):
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )

    if existing_user.status != "active":
        raise HTTPException(
            status_code=403,
            detail="Account is inactive or banned"
        )

    token_data = {
        "sub": str(existing_user.id),
        "role": existing_user.role.value
    }

    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email,
            "role": existing_user.role.value
        }
    }


@router.post("/token/refresh")
def refresh_access_token(
    body: TokenRefreshRequest,
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid or expired refresh token"
    )

    try:
        payload = decode_token(body.refresh_token)

        if payload.get("type") != "refresh":
            raise credentials_exception

        user_id: str = payload.get("sub")
        if not user_id:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or user.status != "active":
        raise credentials_exception

    token_data = {"sub": str(user.id), "role": user.role.value}

    return {
        "access_token": create_access_token(token_data),
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role.value,
        "status": current_user.status
    }