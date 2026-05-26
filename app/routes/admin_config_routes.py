from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter(
    prefix="/admin/config",
    tags=["Admin Config"]
)


# =====================================================
# In-memory demo storage
# Replace with SQLAlchemy models later
# =====================================================

app_configs = [
    {"key": "platform_name",  "value": "BiteBox",          "description": "Application Name"},
    {"key": "platform_email", "value": "hello@bitebox.com", "description": "Support Email"},
    {"key": "currency",       "value": "INR",               "description": "Default Currency"},
]

maintenance_config = {
    "is_active": False,
    "message": {"value": "Platform is under maintenance. Please try again later."}
}

smtp_config = {
    "host":       "",
    "port":       587,
    "username":   "",
    "password":   "",   # never returned to client
    "from_email": "",
    "from_name":  "BiteBox",
    "use_tls":    True,
}

sms_config = {
    "provider":  "msg91",
    "api_key":   "",    # never returned to client
    "sender_id": "BTEBOX",
    "is_active": True,
}

payment_configs: list = []
platform_fees:   list = []
commissions:     list = []
audit_logs:      list = []
notification_templates: list = []
home_layout_sections:   list = []

# Auto-increment counters (avoids stale IDs after deletes)
_fee_counter        = 0
_commission_counter = 0
_template_counter   = 0
_layout_counter     = 0


# =====================================================
# Helper
# =====================================================

def _now() -> str:
    return datetime.utcnow().isoformat()


def _add_audit(user_id: int, action: str, entity: str, entity_id, details: str = ""):
    global audit_logs
    audit_logs.insert(0, {
        "id":         len(audit_logs) + 1,
        "user_id":    user_id,
        "action":     action,
        "entity":     entity,
        "entity_id":  entity_id,
        "details":    details,
        "created_at": _now(),
    })


# =====================================================
# Schemas
# =====================================================

class AppConfigSchema(BaseModel):
    key:         str
    value:       str
    description: Optional[str] = None


class MaintenanceSchema(BaseModel):
    is_active: bool
    message:   str


class SMTPSchema(BaseModel):
    host:       str
    port:       int = 587
    username:   str
    password:   str          # write-only; GET returns empty string
    from_email: str
    from_name:  str
    use_tls:    bool = True


class SMSSchema(BaseModel):
    provider:  str
    api_key:   str           # write-only; GET returns empty string
    sender_id: str
    is_active: bool = True


class PaymentSchema(BaseModel):
    provider:       str
    key_id:         str
    key_secret:     str      # write-only
    webhook_secret: Optional[str] = ""
    is_active:      bool = True


class PlatformFeeSchema(BaseModel):
    fee_type:         str            # "flat" | "percentage"
    value:            float
    min_order_amount: Optional[float] = None
    is_active:        bool = True


class PlatformFeeUpdateSchema(BaseModel):
    fee_type:         Optional[str]   = None
    value:            Optional[float] = None
    min_order_amount: Optional[float] = None
    is_active:        Optional[bool]  = None


class CommissionSchema(BaseModel):
    restaurant_id: Optional[int] = None   # None = global default
    rate:          float
    is_active:     bool = True


class CommissionUpdateSchema(BaseModel):
    restaurant_id: Optional[int]   = None
    rate:          Optional[float] = None
    is_active:     Optional[bool]  = None


class NotificationTemplateSchema(BaseModel):
    event:     str
    channel:   str                   # "email" | "sms" | "push"
    subject:   Optional[str] = ""   # only for email
    body:      str
    is_active: bool = True


class NotificationTemplateUpdateSchema(BaseModel):
    event:     Optional[str]  = None
    channel:   Optional[str]  = None
    subject:   Optional[str]  = None
    body:      Optional[str]  = None
    is_active: Optional[bool] = None


class HomeLayoutSchema(BaseModel):
    section:    str
    title:      Optional[str] = ""
    subtitle:   Optional[str] = ""
    order:      int  = 0
    is_visible: bool = True


class HomeLayoutUpdateSchema(BaseModel):
    section:    Optional[str]  = None
    title:      Optional[str]  = None
    subtitle:   Optional[str]  = None
    order:      Optional[int]  = None
    is_visible: Optional[bool] = None


# =====================================================
# APP CONFIG
# =====================================================

@router.get("/app")
async def get_app_configs():
    return app_configs


@router.put("/app")
async def upsert_app_config(payload: AppConfigSchema):
    """Frontend calls PUT /admin/config/app for both create & update."""
    for config in app_configs:
        if config["key"] == payload.key:
            config.update(payload.dict(exclude_none=True))
            return config

    new_config = payload.dict()
    app_configs.append(new_config)
    return new_config


# =====================================================
# MAINTENANCE
# =====================================================

@router.get("/maintenance")
async def get_maintenance_config():
    return maintenance_config


@router.put("/maintenance")
async def update_maintenance(payload: MaintenanceSchema):
    """Frontend calls PUT /admin/config/maintenance."""
    maintenance_config["is_active"] = payload.is_active
    maintenance_config["message"]   = {"value": payload.message}
    return maintenance_config


# =====================================================
# SMTP CONFIG
# =====================================================

@router.get("/smtp")
async def get_smtp_config():
    """Return config with password masked."""
    return {**smtp_config, "password": ""}


@router.put("/smtp")
async def update_smtp_config(payload: SMTPSchema):
    smtp_config.update(payload.dict())
    return {**smtp_config, "password": ""}


# =====================================================
# SMS CONFIG
# =====================================================

@router.get("/sms")
async def get_sms_config():
    """Return config with api_key masked."""
    return {**sms_config, "api_key": ""}


@router.put("/sms")
async def update_sms_config(payload: SMSSchema):
    sms_config.update(payload.dict())
    return {**sms_config, "api_key": ""}


# =====================================================
# PAYMENT CONFIG
# =====================================================

@router.get("/payment")
async def get_payment_configs():
    """Return all providers with secrets masked."""
    return [
        {**c, "key_secret": "", "webhook_secret": ""}
        for c in payment_configs
    ]


@router.put("/payment")
async def save_payment_config(payload: PaymentSchema):
    """Frontend always calls PUT for upsert by provider."""
    data = payload.dict()

    existing = next(
        (c for c in payment_configs if c["provider"] == payload.provider),
        None
    )

    if existing:
        existing.update(data)
        return {**existing, "key_secret": "", "webhook_secret": ""}

    payment_configs.append(data)
    return {**data, "key_secret": "", "webhook_secret": ""}


# =====================================================
# PLATFORM FEES
# =====================================================

@router.get("/platform-fees")
async def get_platform_fees():
    return platform_fees


@router.post("/platform-fees")
async def create_platform_fee(payload: PlatformFeeSchema):
    global _fee_counter
    _fee_counter += 1
    fee = {"id": _fee_counter, **payload.dict()}
    platform_fees.append(fee)
    return fee


@router.put("/platform-fees/{fee_id}")
async def update_platform_fee(fee_id: int, payload: PlatformFeeUpdateSchema):
    for fee in platform_fees:
        if fee["id"] == fee_id:
            fee.update(payload.dict(exclude_unset=True))
            return fee
    raise HTTPException(status_code=404, detail="Platform fee not found")


@router.delete("/platform-fees/{fee_id}")
async def delete_platform_fee(fee_id: int):
    for fee in platform_fees:
        if fee["id"] == fee_id:
            platform_fees.remove(fee)
            return {"message": "Fee deleted successfully"}
    raise HTTPException(status_code=404, detail="Platform fee not found")


# =====================================================
# COMMISSIONS
# =====================================================

@router.get("/commissions")
async def get_commissions():
    return commissions


@router.post("/commissions")
async def create_commission(payload: CommissionSchema):
    global _commission_counter
    _commission_counter += 1
    commission = {"id": _commission_counter, **payload.dict()}
    commissions.append(commission)
    return commission


@router.put("/commissions/{commission_id}")
async def update_commission(commission_id: int, payload: CommissionUpdateSchema):
    for commission in commissions:
        if commission["id"] == commission_id:
            commission.update(payload.dict(exclude_unset=True))
            return commission
    raise HTTPException(status_code=404, detail="Commission not found")


# =====================================================
# AUDIT LOGS
# =====================================================

@router.get("/audit-logs")
async def get_audit_logs(page: int = 1, limit: int = 20):
    start = (page - 1) * limit
    end   = start + limit
    return {
        "logs":  audit_logs[start:end],
        "total": len(audit_logs),
    }


# =====================================================
# NOTIFICATION TEMPLATES
# =====================================================

@router.get("/notification-templates")
async def get_notification_templates():
    return notification_templates


@router.post("/notification-templates")
async def create_notification_template(payload: NotificationTemplateSchema):
    global _template_counter
    _template_counter += 1
    template = {"id": _template_counter, **payload.dict()}
    notification_templates.append(template)
    return template


@router.put("/notification-templates/{template_id}")
async def update_notification_template(
    template_id: int,
    payload: NotificationTemplateUpdateSchema
):
    for template in notification_templates:
        if template["id"] == template_id:
            template.update(payload.dict(exclude_unset=True))
            return template
    raise HTTPException(status_code=404, detail="Template not found")


@router.delete("/notification-templates/{template_id}")
async def delete_notification_template(template_id: int):
    for template in notification_templates:
        if template["id"] == template_id:
            notification_templates.remove(template)
            return {"message": "Template deleted successfully"}
    raise HTTPException(status_code=404, detail="Template not found")


# =====================================================
# HOME LAYOUT
# =====================================================

@router.get("/home-layout")
async def get_home_layout():
    return sorted(home_layout_sections, key=lambda s: s["order"])


@router.post("/home-layout")
async def create_home_layout_section(payload: HomeLayoutSchema):
    global _layout_counter
    _layout_counter += 1
    section = {"id": _layout_counter, **payload.dict()}
    home_layout_sections.append(section)
    return section


@router.put("/home-layout/{section_id}")
async def update_home_layout_section(
    section_id: int,
    payload: HomeLayoutUpdateSchema
):
    for section in home_layout_sections:
        if section["id"] == section_id:
            section.update(payload.dict(exclude_unset=True))
            return section
    raise HTTPException(status_code=404, detail="Section not found")


@router.delete("/home-layout/{section_id}")
async def delete_home_layout_section(section_id: int):
    for section in home_layout_sections:
        if section["id"] == section_id:
            home_layout_sections.remove(section)
            return {"message": "Section deleted successfully"}
    raise HTTPException(status_code=404, detail="Section not found")