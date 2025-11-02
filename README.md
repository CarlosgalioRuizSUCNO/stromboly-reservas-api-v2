# Stromboly Reservas API (FastAPI + Docker)

Proyecto base para un API REST del hotel **Stromboly**. Incluye:
- FastAPI con endpoint `/health`
- Dockerfile y docker-compose para ejecución local
- Estructura lista para ampliar (modelos, schemas, db, etc.)

## Requisitos
- Docker y Docker Compose

## Ejecución local (con Docker Compose)
```bash
cp .env.example .env
docker compose up --build
# prueba de salud
curl http://localhost:8080/health
```

## Estructura
```
src/app/
  main.py
docker/
  Dockerfile
docker-compose.yml
```

## Próximos pasos
- Añadir endpoints (rooms, customers, bookings)
- Integrar base de datos (PostgreSQL) y migraciones
- Configurar CI/CD e IaC (Terraform) para AWS
