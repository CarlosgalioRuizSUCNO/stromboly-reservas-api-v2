from pydantic import BaseModel, EmailStr

# Esquema base: lo que comparten todas las versiones
class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None  # el teléfono es opcional

# Para crear un cliente (POST)
class CustomerCreate(CustomerBase):
    pass  # usa los mismos campos que el base

# Para mostrar un cliente (GET / respuesta)
class Customer(CustomerBase):
    id: int  # lo agregamos solo cuando ya existe en DB

    class Config:
        orm_mode = True  # permite convertir objetos SQLAlchemy a JSON