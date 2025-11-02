from sqlalchemy import Column, Integer, String, Float
from src.app.db.session import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, unique=True, index=True, nullable=False)
    type = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    status = Column(String, default="available")