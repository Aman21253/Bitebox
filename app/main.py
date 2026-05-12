from fastapi import FastAPI
from app.database.db import engine, Base
from app.models.user_model import User
from app.models.otp_model import OtpToken          # ← new
from app.routes.auth_routes import router as auth_router
from app.routes.otp_routes import router as otp_router   # ← new

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(otp_router)                     # ← new


@app.get("/")
def home():
    return {"message": "Bitebox Backend Running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
