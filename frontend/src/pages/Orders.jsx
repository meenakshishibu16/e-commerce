import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders } from "../api.js";
import { useAuth } from "../state/AuthContext.jsx";

const money = (n) => `₹ ${Number(n || 0).toFixed(0)}`;

function Pill({ children, tone = "default" }) {
  const tones = {
    default: { background: "#fff", border: "1px solid var(--border)", color: "#111827" },
    ok: { background: "#ecfdf3", border: "1px solid #b7f0c8", color: "#14532d" },
    warn: { background: "#fff7ed", border: "1px solid #fed7aa", color: "#7c2d12" },
    info: { background: "#f1f5ff", border: "1px solid #c7d2fe", color: "#1e3a8a" },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        ...tones[tone],
      }}
    >
      {children}
    </span>
  );
}

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }
        setLoading(true);
        setErr("");
        const data = await listOrders(token);
        if (!mounted) return;
        setOrders(data.orders || []);
      } catch (e) {
        if (mounted) setErr(e.message || "Failed");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  if (!token) return <div className="panel small">Login to view orders.</div>;

  return (
    <div>
      <div className="sectionTitle">My Orders</div>
      <div className="sectionSub">
        Track your purchases, payment status, and order progress.
      </div>

      {loading && <div className="small">Loading…</div>}
      {err && <div className="panel small">Error: {err}</div>}

      {!loading && !err && orders.length === 0 && (
        <div className="panel small">No orders yet.</div>
      )}

      {!loading && !err && orders.length > 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((o) => {
            const payStatus = o.paymentStatus || "PENDING";
            const status = o.orderStatus || "PLACED";

            const payTone = payStatus === "PAID" ? "ok" : "warn";
            const statusTone =
              status === "DELIVERED" ? "ok" : status === "CANCELLED" ? "warn" : "info";

            return (
              <div
                key={o._id}
                className="panel"
                style={{
                  borderRadius: "var(--radius2)",
                  padding: 16,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                {/* Left */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 950, letterSpacing: "-.3px" }}>
                    Order #{String(o._id).slice(-8).toUpperCase()}
                  </div>
                  <div className="small" style={{ marginTop: 6 }}>
                    <span style={{ opacity: 0.85 }}>Placed:</span>{" "}
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                  <div className="small" style={{ marginTop: 6, wordBreak: "break-all" }}>
                    ID: {o._id}
                  </div>
                </div>

                {/* Right */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <Pill tone={payTone}>Payment: {o.paymentMethod} / {payStatus}</Pill>
                  <Pill tone={statusTone}>Status: {status}</Pill>
                  <Pill tone="default">Amount: {money(o.subtotal)}</Pill>
                  <Link className="pill" to={`/orders/${o._id}`}>View</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile fix: stack card sections */}
      <style>
        {`
          @media (max-width: 700px){
            .panel[style*="grid-template-columns: 1fr auto"]{
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}
