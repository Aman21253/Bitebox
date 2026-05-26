"""restaurant finance clean

Revision ID: 5b4fdc3cbf92
Revises:
Create Date: 2026-05-26 16:31:17.770267
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '5b4fdc3cbf92'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # ─────────────────────────────────────
    # ORDERS TABLE
    # ─────────────────────────────────────

    op.alter_column(
        'orders',
        'cancellation_reason',
        existing_type=mysql.VARCHAR(length=500),
        type_=sa.Text(),
        existing_nullable=True
    )

    op.alter_column(
        'orders',
        'rejection_reason',
        existing_type=mysql.VARCHAR(length=500),
        type_=sa.Text(),
        existing_nullable=True
    )

    # ─────────────────────────────────────
    # RESTAURANTS TABLE
    # ─────────────────────────────────────

    op.add_column(
        'restaurants',
        sa.Column(
            'gst_number',
            sa.String(length=50),
            nullable=True
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'fssai_number',
            sa.String(length=50),
            nullable=True
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'gst_certificate_url',
            sa.String(length=500),
            nullable=True
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'fssai_certificate_url',
            sa.String(length=500),
            nullable=True
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'pan_card_url',
            sa.String(length=500),
            nullable=True
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'cancelled_cheque_url',
            sa.String(length=500),
            nullable=True
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'bank_account_holder',
            sa.String(length=150),
            nullable=True
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'bank_name',
            sa.String(length=150),
            nullable=True
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'bank_account_number',
            sa.String(length=100),
            nullable=True
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'bank_ifsc',
            sa.String(length=50),
            nullable=True
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'upi_id',
            sa.String(length=100),
            nullable=True
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'available_balance',
            sa.Float(),
            nullable=True,
            server_default="0"
        )
    )

    op.add_column(
        'restaurants',
        sa.Column(
            'lifetime_earnings',
            sa.Float(),
            nullable=True,
            server_default="0"
        )
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column('restaurants', 'lifetime_earnings')

    op.drop_column('restaurants', 'available_balance')

    op.drop_column('restaurants', 'upi_id')

    op.drop_column('restaurants', 'bank_ifsc')

    op.drop_column('restaurants', 'bank_account_number')

    op.drop_column('restaurants', 'bank_name')

    op.drop_column('restaurants', 'bank_account_holder')

    op.drop_column('restaurants', 'cancelled_cheque_url')

    op.drop_column('restaurants', 'pan_card_url')

    op.drop_column('restaurants', 'fssai_certificate_url')

    op.drop_column('restaurants', 'gst_certificate_url')

    op.drop_column('restaurants', 'fssai_number')

    op.drop_column('restaurants', 'gst_number')

    op.alter_column(
        'orders',
        'rejection_reason',
        existing_type=sa.Text(),
        type_=mysql.VARCHAR(length=500),
        existing_nullable=True
    )

    op.alter_column(
        'orders',
        'cancellation_reason',
        existing_type=sa.Text(),
        type_=mysql.VARCHAR(length=500),
        existing_nullable=True
    )