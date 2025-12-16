import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../state/CartContext.jsx";
import { useAuth } from "../state/AuthContext.jsx";

const money = (n) => `₹ ${Number(n || 0).toFixed(0)}`;

export default function Cart() {
  const nav = useNavigate();
  const { token } = useAuth();
  const { cart, totals, loading, setQty, remove, clear } = useCart();

  const items = cart?.items || [];

  return (
    <div>
      <div className="sectionTitle">Your Cart</div>
      <div className="sectionSub">
        Review items, adjust quantity, and proceed to checkout.
      </div>

      {items.length === 0 ? (
        <div className="panel">
          <div className="small">Your cart is empty.</div>
          <div style={{ marginTop: 12 }}>
            <Link className="pill" to="/collection">Continue shopping →</Link>
          </div>
        </div>
      ) : (
        <div className="cartWrap">
          {/* LEFT: items */}
          <div className="panel" style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <b>Items ({items.length})</b>
              <button className="pill" style={{ cursor: "pointer" }} onClick={clear} disabled={loading}>
                Clear cart
              </button>
            </div>

            <div className="hr" />

            <div style={{ display: "grid", gap: 12 }}>
              {items.map((it) => (
                <div
                  key={it._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    padding: 12,
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    background: "#fff",
                    boxShadow: "var(--shadow2)",
                  }}
                >
                  {/* thumbnail */}
                  <img
                    src={it.imageUrlSnapshot || "https://picsum.photos/seed/placeholder/200/200"}
                    alt={it.titleSnapshot}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 14,
                      objectFit: "cover",
                      border: "1px solid var(--border)",
                      background: "#f4f6fb",
                    }}
                  />

                  {/* info */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 850, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {it.titleSnapshot}
                    </div>
                    <div className="small" style={{ marginTop: 4 }}>
                      Size: <b>{it.size}</b> • ₹ {it.priceAtAdd} each
                    </div>

                    {/* qty controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                      <button
                        className="qtyBtn"
                        disabled={loading || it.qty <= 1}
                        onClick={() => setQty(it._id, it.qty - 1)}
                        title="Decrease"
                      >
                        −
                      </button>

                      <span style={{ minWidth: 22, textAlign: "center", fontWeight: 800 }}>
                        {it.qty}
                      </span>

                      <button
                        className="qtyBtn"
                        disabled={loading}
                        onClick={() => setQty(it._id, it.qty + 1)}
                        title="Increase"
                      >
                        +
                      </button>

                      <button
                        className="pill"
                        style={{ cursor: "pointer", marginLeft: 8 }}
                        disabled={loading}
                        onClick={() => remove(it._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* total */}
                  <div style={{ textAlign: "right" }}>
                    <div className="small">Item total</div>
                    <div style={{ fontWeight: 950, fontSize: 16 }}>
                      {money(it.priceAtAdd * it.qty)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: summary */}
          <div className="summary">
            <div style={{ fontWeight: 900, fontSize: 18 }}>Order Summary</div>
            <div className="hr" />

            <div className="kv">
              <span className="small">Items</span>
              <b>{totals?.itemCount || 0}</b>
            </div>

            <div className="kv" style={{ marginTop: 10 }}>
              <span className="small">Subtotal</span>
              <b>{money(totals?.subtotal || 0)}</b>
            </div>

            <div className="small" style={{ marginTop: 10 }}>
              Shipping: free (demo)
            </div>

            <div className="hr" />

            <button
              className="btn"
              disabled={!token || loading}
              onClick={() => nav("/checkout")}
            >
              {token ? "Proceed to Checkout" : "Login to Checkout"}
            </button>

            {!token && (
              <div className="small" style={{ marginTop: 10 }}>
                <Link className="pill" to="/login">Login</Link>{" "}
                <Link className="pill" to="/register">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
