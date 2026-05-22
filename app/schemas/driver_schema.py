from pydantic import BaseModel


# REGISTER DRIVER

class DriverCreate(BaseModel):

    full_name: str
    phone: str
    vehicle_type: str
    vehicle_number: str


# UPDATE DRIVER LOCATION

class DriverLocationUpdate(BaseModel):

    latitude: float
    longitude: float


# ONLINE / OFFLINE STATUS

class DriverStatusUpdate(BaseModel):

    is_online: bool


# DRIVER AVAILABILITY

class DriverAvailabilityRequest(BaseModel):

    is_available: bool


# DELIVERY STATUS

class DeliveryStatusUpdate(BaseModel):

    delivery_status: str