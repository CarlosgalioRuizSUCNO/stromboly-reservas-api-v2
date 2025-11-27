from sqlalchemy import Column, Integer, ForeignKey, Date, Float, String
from sqlalchemy.orm import relationship
from src.app.db.session import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="booked")

    room = relationship("Room")
    customer = relationship("Customer")
