import React, { useEffect, useState } from "react";
import { RoomsApi } from "../api";

const emptyForm = {
  number: "",
  type: "",
  capacity: 1,
  price: 0,
  status: "available",
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await RoomsApi.list();
      setRooms(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las habitaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name === "capacity" || name === "price" ? Number(value) || 0 : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await RoomsApi.update(editingId, form); // necesitarás el PUT en el backend
      } else {
        await RoomsApi.create(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadRooms();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar la habitación.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (room) => {
    setEditingId(room.id);
    setForm({
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      price: room.price,
      status: room.status,
    });
  };

  const onDelete = async (room) => {
    if (!window.confirm(`¿Eliminar la habitación ${room.number}?`)) return;
    try {
      await RoomsApi.remove(room.id);
      await loadRooms();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la habitación.");
    }
  };

  return (
    <div className="page-grid">
      <section className="card">
        <h2 className="card-title">
          {editingId ? "Editar habitación" : "Nueva habitación"}
        </h2>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-row">
            <label>
              Número
              <input
                type="text"
                name="number"
                value={form.number}
                onChange={onChange}
                required
              />
            </label>
            <label>
              Tipo
              <input
                type="text"
                name="type"
                value={form.type}
                onChange={onChange}
                placeholder="Suite, Doble, Individual…"
                required
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Capacidad
              <input
                type="number"
                name="capacity"
                min="1"
                value={form.capacity}
                onChange={onChange}
                required
              />
            </label>
            <label>
              Precio por noche
              <input
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={onChange}
                required
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Estado
              <select name="status" value={form.status} onChange={onChange}>
                <option value="available">Disponible</option>
                <option value="occupied">Ocupada</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={saving}>
              {saving ? "Guardando…" : editingId ? "Guardar cambios" : "Crear"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2 className="card-title">Listado de habitaciones</h2>
        {loading ? (
          <p>Cargando habitaciones…</p>
        ) : rooms.length === 0 ? (
          <p>No hay habitaciones registradas.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tipo</th>
                  <th>Capacidad</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.number}</td>
                    <td>{room.type}</td>
                    <td>{room.capacity}</td>
                    <td>${room.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${room.status}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button
                        className="btn small ghost"
                        onClick={() => onEdit(room)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn small danger"
                        onClick={() => onDelete(room)}
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