from pydantic import BaseModel
from datetime import date

class BookingBase(BaseModel):
    room_id: int
    customer_id: int
    check_in: date
    check_out: date
    status: str = "booked"

class BookingCreate(BookingBase):
    """Schema para crear una reserva. El total_price se calcula automáticamente."""
    pass

class Booking(BookingBase):
    id: int
    total_price: float

    class Config:
        from_attributes = True
