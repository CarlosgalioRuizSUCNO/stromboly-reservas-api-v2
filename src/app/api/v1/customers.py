from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.app.db.session import get_db
from src.app.models.customer import Customer as CustomerModel
from src.app.schemas.customer import Customer, CustomerCreate

router = APIRouter()


@router.get("/", response_model=list[Customer])
def list_customers(db: Session = Depends(get_db)):
    """Obtiene todos los clientes registrados."""
    return db.query(CustomerModel).all()


@router.post("/", response_model=Customer, status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    """Registra un nuevo cliente."""
    exists = db.query(CustomerModel).filter(CustomerModel.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    customer = CustomerModel(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


@router.get("/{customer_id}", response_model=Customer)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    """Obtiene un cliente por ID."""
    customer = db.get(CustomerModel, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return customer


@router.put("/{customer_id}", response_model=Customer)
def update_customer(customer_id: int, payload: CustomerCreate, db: Session = Depends(get_db)):
    """Actualiza los datos de un cliente."""
    customer = db.get(CustomerModel, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    customer.name = payload.name
    customer.email = payload.email
    customer.phone = payload.phone
    db.commit()
    db.refresh(customer)
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    """Elimina un cliente."""
    customer = db.get(CustomerModel, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(customer)
    db.commit()
    return
