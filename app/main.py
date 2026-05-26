from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import (
    engine,
    Base
)

# MODELS

from app.models.user_model import User
from app.models.otp_model import OtpToken
from app.models.restaurant_model import Restaurant
from app.models.refresh_token_model import RefreshToken

from app.models.permission_model import Permission
from app.models.role_permission_model import RolePermission
from app.models.user_address_model import UserAddress

from app.models.menu_category_model import MenuCategory
from app.models.menu_item_model import MenuItem
from app.models.menu_item_variant_model import MenuItemVariant
from app.models.menu_item_addon_model import MenuItemAddon

from app.models.order_model import Order
from app.models.order_item_model import OrderItem
from app.models.order_item_addon_model import OrderItemAddon

from app.models.driver_model import Driver
from app.models.refund_model import Refund
from app.models.coupon_model import Coupon
from app.models.coupon_usage_model import CouponUsage
from app.models.notification_model import Notification
from app.models.review_model import Review

# ROUTES

from app.routes.auth_routes import (
    router as auth_router
)

from app.routes.otp_routes import (
    router as otp_router
)

from app.routes.user_routes import (
    router as user_router
)

from app.routes.admin_routes import (
    router as admin_router
)

from app.routes.restaurant_routes import (
    router as restaurant_router
)

from app.routes.driver_routes import (
    router as driver_router
)

from app.routes.customer_routes import (
    router as customer_router
)

from app.routes.restaurant_management_routes import (
    router as restaurant_management_router
)

from app.routes.menu_routes import (
    router as menu_router
)

from app.routes.public_restaurant_routes import (
    router as public_restaurant_router
)

from app.routes.order_router import (
    router as order_router
)

from app.routes.restaurant_analytics_routes import (
    router as restaurant_analytics_router
)

from app.routes.restaurant_settings_routes import (
    router as restaurant_settings_router
)

from app.routes.websocket_routes import (
    router as websocket_router
)

from app.routes.upload_routes import (
    router as upload_router
)

from app.routes.payment_routes import (
    router as payment_router
)

from app.routes.admin_restaurant_routes import (
    router as admin_restaurant_router
)

from app.routes.refund_routes import (
    router as refund_router
)

from app.routes.coupon_routes import (
    router as coupon_router
)

from app.routes.notification_routes import (
    router as notification_router
)

from app.routes.address_routes import (
    router as address_router
)

from app.routes.review_routes import (
    router as review_router
)
from app.models.restaurant_payout_model import (
    RestaurantPayout
)

from app.models.restaurant_transaction_model import (
    RestaurantTransaction
)
from app.routes.restaurant_payout_routes import (
    router as restaurant_payout_router
)
from app.routes.admin_master_routes import router as admin_master_router
from app.routes.admin_config_routes import router as admin_config_router

# FASTAPI APP

app = FastAPI()

Base.metadata.create_all(bind=engine)

# CORS

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)

# ROUTERS

app.include_router(auth_router)
app.include_router(otp_router)
app.include_router(user_router)
app.include_router(admin_router)
app.include_router(restaurant_router)
app.include_router(driver_router)
app.include_router(customer_router)
app.include_router(
    restaurant_management_router
)
app.include_router(menu_router)
app.include_router(
    public_restaurant_router
)
app.include_router(order_router)
app.include_router(
    restaurant_analytics_router
)
app.include_router(
    restaurant_settings_router
)
app.include_router(websocket_router)
app.include_router(upload_router)
app.include_router(payment_router)
app.include_router(
    admin_restaurant_router
)
app.include_router(refund_router)
app.include_router(coupon_router)
app.include_router(notification_router)
app.include_router(address_router)
app.include_router(review_router)
app.include_router(
    restaurant_payout_router
)


app.include_router(admin_master_router)
app.include_router(admin_config_router)
# HOME

@app.get("/")
def home():

    return {
        "message":
        "Bitebox Backend Running"
    }


# HEALTH CHECK

@app.get("/health")
def health_check():

    return {
        "status":
        "ok"
    }