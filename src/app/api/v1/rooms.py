from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.app.db.session import get_db
from src.app.models.room import Room as RoomModel
from src.app.schemas.room import Room, RoomCreate

router = APIRouter()

@router.get("/", response_model=list[Room])
def list_rooms(db: Session = Depends(get_db)):
    """Obtiene todas las habitaciones registradas."""
    return db.query(RoomModel).all()

@router.post("/", response_model=Room, status_code=status.HTTP_201_CREATED)
def create_room(payload: RoomCreate, db: Session = Depends(get_db)):
    """Crea una nueva habitación."""
    exists = db.query(RoomModel).filter(RoomModel.number == payload.number).first()
    if exists:
        raise HTTPException(status_code=400, detail="El número de habitación ya existe")
    room = RoomModel(
        number=payload.number,
        type=payload.type,
        capacity=payload.capacity,
        price=payload.price,
        status=payload.status,
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return room

@router.get("/{room_id}", response_model=Room)
def get_room(room_id: int, db: Session = Depends(get_db)):
    """Obtiene una habitación por ID."""
    room = db.query(RoomModel).get(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Habitación no encontrada")
    return room

@router.put("/{room_id}", response_model=Room)
def update_room(room_id: int, payload: RoomCreate, db: Session = Depends(get_db)):
    """Actualiza los datos de una habitación."""
    room = db.query(RoomModel).get(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Habitación no encontrada")
    room.number = payload.number
    room.type = payload.type
    room.capacity = payload.capacity
    room.price = payload.price
    room.status = payload.status
    db.commit()
    db.refresh(room)
    return room

@router.delete("/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(room_id: int, db: Session = Depends(get_db)):
    """Elimina una habitación."""
    room = db.query(RoomModel).get(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Habitación no encontrada")
    db.delete(room)
    db.commit()
    return