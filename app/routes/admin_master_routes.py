from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(
    prefix="/admin/master",
    tags=["Admin Master"]
)


# =====================================================
# In-memory demo storage
# Replace with SQLAlchemy models later
# =====================================================

countries_db: list = [
    {"id": 1, "name": "India",         "code": "IN", "is_active": True},
    {"id": 2, "name": "United States", "code": "US", "is_active": True},
]

states_db: list = [
    {"id": 1, "name": "Rajasthan",  "country_id": 1, "is_active": True},
    {"id": 2, "name": "Maharashtra","country_id": 1, "is_active": True},
    {"id": 3, "name": "California", "country_id": 2, "is_active": True},
]

cuisines_db: list = [
    {"id": 1, "name": "Indian",   "is_active": True},
    {"id": 2, "name": "Chinese",  "is_active": True},
    {"id": 3, "name": "Italian",  "is_active": True},
]

taxes_db: list = [
    {"id": 1, "name": "GST 5%",  "rate": 5.0,  "applicable_on": "order",    "is_active": True},
    {"id": 2, "name": "GST 18%", "rate": 18.0, "applicable_on": "order",    "is_active": True},
    {"id": 3, "name": "Delivery Tax", "rate": 2.0, "applicable_on": "delivery", "is_active": True},
]

currencies_db: list = [
    {"id": 1, "name": "Indian Rupee",  "code": "INR", "symbol": "₹", "is_default": True,  "is_active": True},
    {"id": 2, "name": "US Dollar",     "code": "USD", "symbol": "$", "is_default": False, "is_active": True},
]

languages_db: list = [
    {"id": 1, "name": "English", "code": "en", "is_default": True,  "is_active": True},
    {"id": 2, "name": "Hindi",   "code": "hi", "is_default": False, "is_active": True},
]

# Auto-increment counters (safe after deletes)
_country_counter  = len(countries_db)
_state_counter    = len(states_db)
_cuisine_counter  = len(cuisines_db)
_tax_counter      = len(taxes_db)
_currency_counter = len(currencies_db)
_language_counter = len(languages_db)


# =====================================================
# Schemas — Countries
# =====================================================

class CountryCreate(BaseModel):
    name:      str
    code:      str
    is_active: bool = True


class CountryUpdate(BaseModel):
    name:      Optional[str]  = None
    code:      Optional[str]  = None
    is_active: Optional[bool] = None


# =====================================================
# Schemas — States
# =====================================================

class StateCreate(BaseModel):
    name:       str
    country_id: int
    is_active:  bool = True


class StateUpdate(BaseModel):
    name:       Optional[str]  = None
    country_id: Optional[int]  = None
    is_active:  Optional[bool] = None


# =====================================================
# Schemas — Cuisines
# =====================================================

class CuisineCreate(BaseModel):
    name:      str
    is_active: bool = True


class CuisineUpdate(BaseModel):
    name:      Optional[str]  = None
    is_active: Optional[bool] = None


# =====================================================
# Schemas — Taxes
# =====================================================

class TaxCreate(BaseModel):
    name:           str
    rate:           float
    applicable_on:  str  = "order"   # "order" | "delivery" | "both"
    is_active:      bool = True


class TaxUpdate(BaseModel):
    name:          Optional[str]   = None
    rate:          Optional[float] = None
    applicable_on: Optional[str]   = None
    is_active:     Optional[bool]  = None


# =====================================================
# Schemas — Currencies
# =====================================================

class CurrencyCreate(BaseModel):
    name:       str
    code:       str
    symbol:     str
    is_default: bool = False
    is_active:  bool = True


class CurrencyUpdate(BaseModel):
    name:       Optional[str]  = None
    code:       Optional[str]  = None
    symbol:     Optional[str]  = None
    is_default: Optional[bool] = None
    is_active:  Optional[bool] = None


# =====================================================
# Schemas — Languages
# =====================================================

class LanguageCreate(BaseModel):
    name:       str
    code:       str
    is_default: bool = False
    is_active:  bool = True


class LanguageUpdate(BaseModel):
    name:       Optional[str]  = None
    code:       Optional[str]  = None
    is_default: Optional[bool] = None
    is_active:  Optional[bool] = None


# =====================================================
# COUNTRIES
# =====================================================

@router.get("/countries")
async def get_countries():
    return countries_db


@router.post("/countries")
async def create_country(payload: CountryCreate):
    global _country_counter
    _country_counter += 1
    new_country = {"id": _country_counter, **payload.dict()}
    countries_db.append(new_country)
    return new_country


@router.put("/countries/{country_id}")
async def update_country(country_id: int, payload: CountryUpdate):
    for country in countries_db:
        if country["id"] == country_id:
            country.update(payload.dict(exclude_unset=True))
            return country
    raise HTTPException(status_code=404, detail="Country not found")


@router.delete("/countries/{country_id}")
async def delete_country(country_id: int):
    for country in countries_db:
        if country["id"] == country_id:
            countries_db.remove(country)
            return {"message": "Country deleted successfully"}
    raise HTTPException(status_code=404, detail="Country not found")


# =====================================================
# STATES
# =====================================================

@router.get("/states")
async def get_states(country_id: Optional[int] = None):
    if country_id:
        return [s for s in states_db if s["country_id"] == country_id]
    return states_db


@router.post("/states")
async def create_state(payload: StateCreate):
    global _state_counter
    _state_counter += 1
    new_state = {"id": _state_counter, **payload.dict()}
    states_db.append(new_state)
    return new_state


@router.put("/states/{state_id}")
async def update_state(state_id: int, payload: StateUpdate):
    for state in states_db:
        if state["id"] == state_id:
            state.update(payload.dict(exclude_unset=True))
            return state
    raise HTTPException(status_code=404, detail="State not found")


@router.delete("/states/{state_id}")
async def delete_state(state_id: int):
    for state in states_db:
        if state["id"] == state_id:
            states_db.remove(state)
            return {"message": "State deleted successfully"}
    raise HTTPException(status_code=404, detail="State not found")


# =====================================================
# CUISINES
# =====================================================

@router.get("/cuisines")
async def get_cuisines():
    return cuisines_db


@router.post("/cuisines")
async def create_cuisine(payload: CuisineCreate):
    global _cuisine_counter
    _cuisine_counter += 1
    new_cuisine = {"id": _cuisine_counter, **payload.dict()}
    cuisines_db.append(new_cuisine)
    return new_cuisine


@router.put("/cuisines/{cuisine_id}")
async def update_cuisine(cuisine_id: int, payload: CuisineUpdate):
    for cuisine in cuisines_db:
        if cuisine["id"] == cuisine_id:
            cuisine.update(payload.dict(exclude_unset=True))
            return cuisine
    raise HTTPException(status_code=404, detail="Cuisine not found")


@router.delete("/cuisines/{cuisine_id}")
async def delete_cuisine(cuisine_id: int):
    for cuisine in cuisines_db:
        if cuisine["id"] == cuisine_id:
            cuisines_db.remove(cuisine)
            return {"message": "Cuisine deleted successfully"}
    raise HTTPException(status_code=404, detail="Cuisine not found")


# =====================================================
# TAXES
# =====================================================

@router.get("/taxes")
async def get_taxes():
    return taxes_db


@router.post("/taxes")
async def create_tax(payload: TaxCreate):
    global _tax_counter
    _tax_counter += 1
    new_tax = {"id": _tax_counter, **payload.dict()}
    taxes_db.append(new_tax)
    return new_tax


@router.put("/taxes/{tax_id}")
async def update_tax(tax_id: int, payload: TaxUpdate):
    for tax in taxes_db:
        if tax["id"] == tax_id:
            tax.update(payload.dict(exclude_unset=True))
            return tax
    raise HTTPException(status_code=404, detail="Tax not found")


@router.delete("/taxes/{tax_id}")
async def delete_tax(tax_id: int):
    for tax in taxes_db:
        if tax["id"] == tax_id:
            taxes_db.remove(tax)
            return {"message": "Tax deleted successfully"}
    raise HTTPException(status_code=404, detail="Tax not found")


# =====================================================
# CURRENCIES
# =====================================================

@router.get("/currencies")
async def get_currencies():
    return currencies_db


@router.post("/currencies")
async def create_currency(payload: CurrencyCreate):
    global _currency_counter
    _currency_counter += 1

    # Unset all other defaults if this is being set as default
    if payload.is_default:
        for c in currencies_db:
            c["is_default"] = False

    new_currency = {"id": _currency_counter, **payload.dict()}
    currencies_db.append(new_currency)
    return new_currency


@router.put("/currencies/{currency_id}")
async def update_currency(currency_id: int, payload: CurrencyUpdate):
    for currency in currencies_db:
        if currency["id"] == currency_id:
            # Enforce single default
            if payload.is_default:
                for c in currencies_db:
                    c["is_default"] = False
            currency.update(payload.dict(exclude_unset=True))
            return currency
    raise HTTPException(status_code=404, detail="Currency not found")


# =====================================================
# LANGUAGES
# =====================================================

@router.get("/languages")
async def get_languages():
    return languages_db


@router.post("/languages")
async def create_language(payload: LanguageCreate):
    global _language_counter
    _language_counter += 1

    # Enforce single default
    if payload.is_default:
        for l in languages_db:
            l["is_default"] = False

    new_language = {"id": _language_counter, **payload.dict()}
    languages_db.append(new_language)
    return new_language


@router.put("/languages/{language_id}")
async def update_language(language_id: int, payload: LanguageUpdate):
    for language in languages_db:
        if language["id"] == language_id:
            # Enforce single default
            if payload.is_default:
                for l in languages_db:
                    l["is_default"] = False
            language.update(payload.dict(exclude_unset=True))
            return language
    raise HTTPException(status_code=404, detail="Language not found")