from fastapi import FastAPI
from app.database.db import engine, Base
from app.models.user_model import User
from app.models.otp_model import OtpToken
from app.routes.auth_routes import router as auth_router
from app.routes.otp_routes import router as otp_router
from app.routes.user_routes import router as user_router
from app.routes.admin_routes import router as admin_router
from app.routes.restaurant_routes import router as restaurant_router
from app.routes.driver_routes import router as driver_router
from app.routes.customer_routes import router as customer_router
from app.models.restaurant_model import Restaurant
from app.routes.restaurant_management_routes import router as restaurant_management_router
from app.models.refresh_token_model import RefreshToken

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(otp_router)
app.include_router(user_router)
app.include_router(admin_router)
app.include_router(restaurant_router)
app.include_router(driver_router)
app.include_router(customer_router)
app.include_router(restaurant_management_router)

@app.get("/")
def home():
    return {"message": "Bitebox Backend Running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
