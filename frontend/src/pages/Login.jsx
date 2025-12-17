import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errEmail, setErrEmail] = useState("");
  const [errPass, setErrPass] = useState("");
  const [serverErr, setServerErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErrEmail("");
    setErrPass("");
    setServerErr("");

    let ok = true;
    if (!emailOk(email)) {
      setErrEmail("Please enter a valid email address.");
      ok = false;
    }
    if (String(password || "").length === 0) {
      setErrPass("Password cannot be empty.");
      ok = false;
    }
    if (!ok) return;

    try {
      setBusy(true);

      // ✅ FIX: send one payload object
      await login({ email: email.trim(), password });

      nav("/");
    } catch (e2) {
      // show friendly message
      setServerErr(e2.message || "Login failed. Please check your credentials.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="form">
      <div className="title" style={{ marginTop: 0 }}>Login</div>
      <div className="small">Welcome back. Please login to continue.</div>
      <div className="hr" />

      {serverErr && (
        <div
          className="toast small"
          style={{ borderColor: "#fecaca", background: "#fff1f2", color: "#991b1b" }}
        >
          {serverErr}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div>
          <input
            className="input"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errEmail && <div className="small" style={{ color: "#b91c1c", marginTop: 6 }}>{errEmail}</div>}
        </div>

        <div style={{ height: 12 }} />

        <div>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errPass && <div className="small" style={{ color: "#b91c1c", marginTop: 6 }}>{errPass}</div>}
        </div>

        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Logging in…" : "Login"}
        </button>
      </form>

      <div className="hr" />
      <div className="small">
        Don’t have an account? <Link className="pill" to="/register">Register</Link>
      </div>
    </div>
  );
}
