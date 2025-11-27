from pydantic import BaseModel


class RoomBase(BaseModel):
    number: str
    type: str
    capacity: int
    price: float
    status: str = "available"


class RoomCreate(RoomBase):
    pass


class Room(RoomBase):
    id: int

    class Config:
        from_attributes = True
