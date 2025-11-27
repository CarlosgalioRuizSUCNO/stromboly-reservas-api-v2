import React, { useEffect, useState } from "react";
import { RoomsApi, CustomersApi, BookingsApi } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    rooms: 0,
    customers: 0,
    bookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [rooms, customers, bookings] = await Promise.all([
          RoomsApi.list(),
          CustomersApi.list(),
          BookingsApi.list(),
        ]);
        if (!cancelled) {
          setStats({
            rooms: rooms.length,
            customers: customers.length,
            bookings: bookings.length,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p>Cargando indicadores…</p>;
  }

  return (
    <div className="cards-grid">
      <div className="card">
        <h2 className="card-title">Habitaciones</h2>
        <p className="card-main-number">{stats.rooms}</p>
        <p className="card-help">Habitaciones registradas en el sistema.</p>
      </div>
      <div className="card">
        <h2 className="card-title">Clientes</h2>
        <p className="card-main-number">{stats.customers}</p>
        <p className="card-help">Clientes con historial de reserva.</p>
      </div>
      <div className="card">
        <h2 className="card-title">Reservas</h2>
        <p className="card-main-number">{stats.bookings}</p>
        <p className="card-help">Reservas totales registradas.</p>
      </div>
    </div>
  );
}