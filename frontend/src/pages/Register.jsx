import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
const strongPw = (pw) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(String(pw || ""));

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      String(name).trim().length >= 2 &&
      emailOk(email) &&
      strongPw(password) &&
      password === confirm &&
      !busy
    );
  }, [name, email, password, confirm, busy]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (String(name).trim().length < 2) return setErr("Name must be at least 2 characters.");
    if (!emailOk(email)) return setErr("Enter a valid email address.");
    if (!strongPw(password)) return setErr("Password must be 8+ and include Upper, Lower, Number, Special.");
    if (password !== confirm) return setErr("Passwords do not match.");

    try {
      setBusy(true);

      // ✅ FIX: send a single payload object (matches AuthContext + backend)
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      nav("/");
    } catch (e2) {
      setErr(e2.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="form">
      <div className="title" style={{ marginTop: 0 }}>Register</div>
      <div className="small">Create an account to checkout, wishlist, and review.</div>
      <div className="hr" />

      {err && (
        <div
          className="toast small"
          style={{ borderColor: "#fecaca", background: "#fff1f2", color: "#991b1b" }}
        >
          Error: {err}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <input
          className="input"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div style={{ height: 10 }} />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div style={{ height: 10 }} />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ height: 10 }} />
        <input
          className="input"
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <div className="small" style={{ marginTop: 10, lineHeight: 1.6 }}>
          Password must be <b>8+</b> chars and include <b>Upper</b>, <b>Lower</b>, <b>Number</b>, <b>Special</b>.
        </div>

        <button className="btn" type="submit" disabled={!canSubmit}>
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>

      <div className="hr" />
      <div className="small">
        Already have an account? <Link className="pill" to="/login">Login</Link>
      </div>
    </div>
  );
}
