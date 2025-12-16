import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../api.js";
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

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
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
        const data = await getOrder(token, id);
        if (!mounted) return;
        setOrder(data.order);
      } catch (e) {
        if (mounted) setErr(e.message || "Failed");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token, id]);

  if (!token) return <div className="panel small">Login to view this order.</div>;
  if (loading) return <div className="small">Loading…</div>;
  if (err) return <div className="panel small">Error: {err}</div>;
  if (!order) return <div className="panel small">Order not found.</div>;

  const a = order.shippingAddress || {};
  const items = order.items || [];

  const paymentStatus = order.paymentStatus || "PENDING";
  const orderStatus = order.orderStatus || "PLACED";

  const payTone = paymentStatus === "PAID" ? "ok" : "warn";
  const statusTone =
    orderStatus === "DELIVERED" ? "ok" : orderStatus === "CANCELLED" ? "warn" : "info";

  return (
    <div>
      <Link className="pill" to="/orders">← Back to orders</Link>

      <div className="hr" />

      {/* Header card */}
      <div className="panel" style={{ borderRadius: "var(--radius2)", padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 950, fontSize: 28, letterSpacing: "-.5px" }}>Order</div>
            <div className="small">ID: {order._id}</div>
            {order.stripeSessionId && (
              <div className="small" style={{ marginTop: 6 }}>
                Stripe session: {order.stripeSessionId}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Pill tone={payTone}>Payment: {order.paymentMethod} / {paymentStatus}</Pill>
            <Pill tone={statusTone}>Status: {orderStatus}</Pill>
            <Pill tone="default">Subtotal: {money(order.subtotal)}</Pill>
          </div>
        </div>
      </div>

      <div className="hr" />

      {/* Two columns: Items + Address */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr .8fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Items */}
        <div className="panel" style={{ borderRadius: "var(--radius2)" }}>
          <div style={{ fontWeight: 950, fontSize: 18 }}>Items</div>
          <div className="hr" />

          <div style={{ display: "grid", gap: 12 }}>
            {items.map((it, idx) => {
              // Your original items use it.title / it.price
              const title = it.title || it.titleSnapshot || "Item";
              const img =
                it.imageUrlSnapshot || it.imageSnapshot || it.imageUrl || "";
              const qty = Number(it.qty || 1);
              const each = Number(it.price || it.priceAtAdd || 0);

              return (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "64px 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    padding: 12,
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    background: "#fff",
                    boxShadow: "var(--shadow2)",
                  }}
                >
                  <img
                    src={img || "https://picsum.photos/seed/order/200/200"}
                    alt={title}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 14,
                      objectFit: "cover",
                      border: "1px solid var(--border)",
                      background: "#f4f6fb",
                    }}
                  />

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 950,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {title}
                    </div>
                    <div className="small" style={{ marginTop: 6 }}>
                      Size: <b>{it.size || "—"}</b> • {money(each)} each
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div className="small">Qty</div>
                    <div style={{ fontWeight: 900 }}>{qty}</div>
                    <div className="small" style={{ marginTop: 6 }}>Total</div>
                    <div style={{ fontWeight: 950, fontSize: 16 }}>
                      {money(each * qty)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Address */}
        <div className="panel" style={{ borderRadius: "var(--radius2)" }}>
          <div style={{ fontWeight: 950, fontSize: 18 }}>Delivery address</div>
          <div className="hr" />

          <div style={{ lineHeight: 1.9 }}>
            <div style={{ fontWeight: 950, fontSize: 18 }}>
              {a.fullName || "—"}
            </div>
            <div className="small">{a.phone || ""}</div>

            <div className="hr" />

            <div>{a.line1 || ""}</div>
            {a.line2 ? <div>{a.line2}</div> : null}
            <div>
              {(a.city || "")}
              {a.city && a.state ? ", " : ""}
              {(a.state || "")} {a.pincode || ""}
            </div>
            <div>{a.country || ""}</div>
          </div>
        </div>
      </div>

      {/* Responsive: stack columns on mobile */}
      <style>
        {`
          @media (max-width: 900px){
            .container > div[style*="grid-template-columns: 1.2fr .8fr"]{
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}
