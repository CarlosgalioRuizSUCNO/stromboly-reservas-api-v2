from pydantic import BaseModel
from datetime import date

class BookingBase(BaseModel):
    room_id: int
    customer_id: int
    check_in: date
    check_out: date
    total_price: float
    status: str = "booked"

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int

    class Config:
        orm_mode = True