import React, { useEffect, useState } from "react";
import { CustomersApi } from "../api";

const emptyForm = { name: "", email: "", phone: "" };

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomersApi.list();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
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
      if (editingId) {
        await CustomersApi.update(editingId, form); // requiere PUT en el backend
      } else {
        await CustomersApi.create(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadCustomers();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar el cliente.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
    });
  };

  const onDelete = async (customer) => {
    if (!window.confirm(`¿Eliminar al cliente ${customer.name}?`)) return;
    try {
      await CustomersApi.remove(customer.id);
      await loadCustomers();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el cliente.");
    }
  };

  return (
    <div className="page-grid">
      <section className="card">
        <h2 className="card-title">
          {editingId ? "Editar cliente" : "Nuevo cliente"}
        </h2>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-row">
            <label>
              Nombre completo
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </label>
            <label>
              Correo electrónico
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Teléfono
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
              />
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
        <h2 className="card-title">Listado de clientes</h2>
        {loading ? (
          <p>Cargando clientes…</p>
        ) : customers.length === 0 ? (
          <p>No hay clientes registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || "—"}</td>
                    <td className="table-actions">
                      <button
                        className="btn small ghost"
                        onClick={() => onEdit(c)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn small danger"
                        onClick={() => onDelete(c)}
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