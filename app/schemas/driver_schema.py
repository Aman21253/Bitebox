from pydantic import BaseModel


class DriverAvailabilityRequest(BaseModel):

    is_available: bool


class DriverLocationUpdateRequest(BaseModel):

    latitude: float

    longitude: float