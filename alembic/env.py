from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from app.database.db import Base

# IMPORT ALL MODELS

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

from app.models.restaurant_payout_model import RestaurantPayout
from app.models.restaurant_transaction_model import RestaurantTransaction

# this is the Alembic Config object
config = context.config

# Interpret config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ADD METADATA

target_metadata = Base.metadata


def run_migrations_offline():

    url = config.get_main_option(
        "sqlalchemy.url"
    )

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named"
        },
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():

    connectable = engine_from_config(
        config.get_section(
            config.config_ini_section
        ),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:

        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():

    run_migrations_offline()

else:

    run_migrations_online()