import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import RoomsPage from "./pages/RoomsPage";
import CustomersPage from "./pages/CustomersPage";
import BookingsPage from "./pages/BookingsPage";
import Login from "./pages/Login";

const MENU = [
  { id: "dashboard", label: "Dashboard" },
  { id: "rooms", label: "Habitaciones" },
  { id: "customers", label: "Clientes" },
  { id: "bookings", label: "Reservas" },
];

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("stromboly_user");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("stromboly_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("stromboly_user");
  };

  const renderPage = () => {
    switch (active) {
      case "rooms":
        return <RoomsPage />;
      case "customers":
        return <CustomersPage />;
      case "bookings":
        return <BookingsPage />;
      default:
        return <Dashboard />;
    }
  };

  // 🔐 Si no hay usuario logueado, solo mostramos la pantalla de login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-root">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-mark">S</div>
          <div>
            <div className="brand-title">Hotel Stromboly</div>
            <div className="brand-subtitle">Gestión de reservas</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {MENU.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                active === item.id ? "nav-item-active" : ""
              }`}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-footer-text">
            Panel interno · Uso exclusivo del personal
          </p>
        </div>
      </aside>

      <main className="main">
        <header className="main-header">
          <div>
            <h1 className="main-title">
              {MENU.find((m) => m.id === active)?.label}
            </h1>
            <p className="main-subtitle">
              Control centralizado de habitaciones, clientes y reservas.
            </p>
          </div>

          <div className="main-header-right">
            <div className="user-pill">
              <span className="user-avatar">
                {user.email?.[0]?.toUpperCase() || "U"}
              </span>
              <div className="user-info">
                <span className="user-email">{user.email}</span>
                <span className="user-role">
                  {user.role === "admin" ? "Administrador" : "Usuario"}
                </span>
              </div>
            </div>
            <button className="btn ghost small" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </header>

        <section className="main-content">{renderPage()}</section>
      </main>
    </div>
  );
}