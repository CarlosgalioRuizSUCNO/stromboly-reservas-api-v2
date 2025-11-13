from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.app.api.v1 import rooms as rooms_router
from src.app.api.v1 import customers as customers_router
from src.app.api.v1 import bookings as bookings_router   # <-- NUEVO
from src.app.db.init_db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestiona el ciclo de vida de la aplicación"""
    # Startup: Inicializa la base de datos
    init_db()
    yield
    # Shutdown: Aquí se pueden agregar tareas de limpieza si es necesario

app = FastAPI(
    title="Stromboly Reservas API",
    version="0.1.0",
    description="API REST para gestionar reservas del Hotel Stromboly.",
    debug=True,
    lifespan=lifespan,
)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(rooms_router.router, prefix="/rooms", tags=["rooms"])
app.include_router(customers_router.router, prefix="/customers", tags=["customers"])
app.include_router(bookings_router.router, prefix="/bookings", tags=["bookings"])  # <-- NUEVO

if __name__ == "__main__":
    import uvicorn
    import os

    port = int(os.getenv("APP_PORT", "8080"))
    uvicorn.run("src.app.main:app", host="0.0.0.0", port=port)