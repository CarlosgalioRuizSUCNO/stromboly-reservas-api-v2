"""
Script para crear todas las tablas en la base de datos.
Ejecuta este archivo antes de iniciar la aplicación por primera vez.
"""
from src.app.db.session import Base, engine
from src.app.models.room import Room
from src.app.models.customer import Customer
from src.app.models.booking import Booking

def init_db():
    """Crea todas las tablas definidas en los modelos"""
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas exitosamente:")
    print("  - rooms")
    print("  - customers")
    print("  - bookings")

if __name__ == "__main__":
    init_db()

