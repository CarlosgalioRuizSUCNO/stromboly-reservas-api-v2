import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔐 Login MOCK en frontend
      // Cambia esto por una llamada a tu API cuando tengas endpoint de auth
      if (email === "admin@stromboly.com" && password === "admin123") {
        onLogin({ email, role: "admin" });
      } else {
        setError("Credenciales incorrectas. Inténtalo nuevamente.");
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark">S</div>
          <div>
            <h1 className="login-title">Hotel Stromboly</h1>
            <p className="login-subtitle">Panel de administración</p>
          </div>
        </div>

        <form className="form login-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@stromboly.com"
                required
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions login-actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Ingresando…" : "Ingresar"}
            </button>
          </div>
        </form>

        <p className="login-footer">
          Usuario demo: <strong>admin@stromboly.com</strong> · Contraseña:{" "}
          <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}