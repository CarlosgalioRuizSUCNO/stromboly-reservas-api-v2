from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

from src.app.db.session import get_db
from src.app.models.booking import Booking as BookingModel
from src.app.models.room import Room as RoomModel
from src.app.models.customer import Customer as CustomerModel
from src.app.schemas.booking import Booking, BookingCreate

router = APIRouter()


def _validate_dates(check_in: date, check_out: date):
    if check_in >= check_out:
        raise HTTPException(status_code=400, detail="check_in debe ser menor a check_out")
    if (check_out - check_in).days > 60:
        # límite sanitario para evitar reservas absurdamente largas (opcional)
        raise HTTPException(status_code=400, detail="Reserva excede el límite de noches permitido")


def _overlap_filter(check_in: date, check_out: date):
    """Hay solape si: (A.start < B.end) y (B.start < A.end)"""
    return and_(BookingModel.check_in < check_out,
                check_in < BookingModel.check_out)


@router.get("/", response_model=list[Booking])
def list_bookings(
        db: Session = Depends(get_db),
        room_id: int | None = Query(default=None),
        customer_id: int | None = Query(default=None),
        status_filter: str | None = Query(default=None, description="booked|checked_in|completed|cancelled"),
):
    q = db.query(BookingModel)
    if room_id is not None:
        q = q.filter(BookingModel.room_id == room_id)
    if customer_id is not None:
        q = q.filter(BookingModel.customer_id == customer_id)
    if status_filter is not None:
        q = q.filter(BookingModel.status == status_filter)
    return q.order_by(BookingModel.id.desc()).all()


@router.get("/{booking_id}", response_model=Booking)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    bk = db.get(BookingModel, booking_id)
    if not bk:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    return bk


@router.post("/", response_model=Booking, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    """
    Crea una reserva:
    - Valida fechas
    - Valida existencia de room y customer
    - Evita solapamientos (booked/checked_in/completed)
    - Calcula total_price = noches * room.price
    """
    _validate_dates(payload.check_in, payload.check_out)

    room = db.get(RoomModel, payload.room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Habitación no existe")

    customer = db.get(CustomerModel, payload.customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no existe")

    # Evitar solape con reservas activas
    active_status = ("booked", "checked_in", "completed")
    overlap = (
        db.query(BookingModel)
        .filter(
            BookingModel.room_id == payload.room_id,
            BookingModel.status.in_(active_status),
            _overlap_filter(payload.check_in, payload.check_out),
        )
        .first()
    )
    if overlap:
        raise HTTPException(status_code=409, detail="La habitación ya está reservada en esas fechas")

    nights = (payload.check_out - payload.check_in).days
    if nights <= 0:
        raise HTTPException(status_code=400, detail="Rango de fechas inválido")

    total_price = float(nights * room.price)

    bk = BookingModel(
        room_id=payload.room_id,
        customer_id=payload.customer_id,
        check_in=payload.check_in,
        check_out=payload.check_out,
        total_price=total_price,
        status=payload.status or "booked",
    )
    db.add(bk)
    db.commit()
    db.refresh(bk)
    return bk


@router.patch("/{booking_id}/status", response_model=Booking)
def update_status(booking_id: int, status_value: str, db: Session = Depends(get_db)):
    """
    Cambia el estado de la reserva. Valores esperados:
    - booked | checked_in | completed | cancelled
    """
    allowed = {"booked", "checked_in", "completed", "cancelled"}
    if status_value not in allowed:
        raise HTTPException(status_code=400, detail=f"status inválido. Permitidos: {', '.join(sorted(allowed))}")

    bk = db.get(BookingModel, booking_id)
    if not bk:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")

    bk.status = status_value
    db.commit()
    db.refresh(bk)
    return bk


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    bk = db.get(BookingModel, booking_id)
    if not bk:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    db.delete(bk)
    db.commit()
    return
