import React, { useEffect, useState } from "react";
import { BookingsApi, RoomsApi, CustomersApi } from "../api";

const emptyForm = {
  room_id: "",
  customer_id: "",
  check_in: "",
  check_out: "",
  status: "booked",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [bk, rm, cu] = await Promise.all([
        BookingsApi.list(),
        RoomsApi.list(),
        CustomersApi.list(),
      ]);
      setBookings(bk);
      setRooms(rm);
      setCustomers(cu);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await BookingsApi.create({
        room_id: Number(form.room_id),
        customer_id: Number(form.customer_id),
        check_in: form.check_in,
        check_out: form.check_out,
        status: form.status,
      });
      setForm(emptyForm);
      await loadAll();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Ocurrió un error al crear la reserva. Verifica disponibilidad y fechas."
      );
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (booking) => {
    if (
      !window.confirm(
        `¿Eliminar la reserva ${booking.id} de la habitación ${booking.room_id}?`
      )
    )
      return;
    try {
      await BookingsApi.remove(booking.id);
      await loadAll();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la reserva.");
    }
  };

  const roomLabel = (id) =>
    rooms.find((r) => r.id === id)?.number || `#${id}`;
  const customerLabel = (id) =>
    customers.find((c) => c.id === id)?.name || `Cliente ${id}`;

  return (
    <div className="page-grid">
      <section className="card">
        <h2 className="card-title">Nueva reserva</h2>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-row">
            <label>
              Habitación
              <select
                name="room_id"
                value={form.room_id}
                onChange={onChange}
                required
              >
                <option value="">Selecciona una habitación</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.number} · {r.type}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Cliente
              <select
                name="customer_id"
                value={form.customer_id}
                onChange={onChange}
                required
              >
                <option value="">Selecciona un cliente</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Check-in
              <input
                type="date"
                name="check_in"
                value={form.check_in}
                onChange={onChange}
                required
              />
            </label>
            <label>
              Check-out
              <input
                type="date"
                name="check_out"
                value={form.check_out}
                onChange={onChange}
                required
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Estado
              <select name="status" value={form.status} onChange={onChange}>
                <option value="booked">Reservada</option>
                <option value="checked_in">Check-in</option>
                <option value="checked_out">Check-out</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Crear reserva"}
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <h2 className="card-title">Listado de reservas</h2>
        {loading ? (
          <p>Cargando reservas…</p>
        ) : bookings.length === 0 ? (
          <p>No hay reservas registradas.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Habitación</th>
                  <th>Cliente</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{roomLabel(b.room_id)}</td>
                    <td>{customerLabel(b.customer_id)}</td>
                    <td>{b.check_in}</td>
                    <td>{b.check_out}</td>
                    <td>
                      <span className={`badge badge-${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>${b.total_price?.toFixed(2)}</td>
                    <td className="table-actions">
                      <button
                        className="btn small danger"
                        onClick={() => onDelete(b)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}