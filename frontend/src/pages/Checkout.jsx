import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCODOrder, createStripeSession } from "../api.js";
import { useAuth } from "../state/AuthContext.jsx";
import { useCart } from "../state/CartContext.jsx";

const money = (n) => `₹ ${Number(n || 0).toFixed(0)}`;

export default function Checkout() {
  const nav = useNavigate();
  const { token, user } = useAuth();

  // ✅ ADD clear FROM CART CONTEXT
  const { cart, totals, loading: cartBusy, clear } = useCart();

  const [pm, setPm] = useState("COD");
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");
  const [addr, setAddr] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const items = cart?.items || [];

  const canSubmit = useMemo(() => {
    if (!token) return false;
    if (items.length === 0) return false;
    const reqd = ["fullName", "phone", "line1", "city", "state", "pincode"];
    return reqd.every((k) => String(addr[k] || "").trim().length > 0);
  }, [token, items.length, addr]);

  async function placeOrder() {
    setErr("");
    setStatus("");

    try {
      if (pm === "COD") {
        setStatus("Placing COD order…");

        const data = await createCODOrder(token, addr);

        // ✅ THIS IS THE IMPORTANT LINE
        await clear(); // cart is emptied after order is confirmed

        setStatus("Order placed!");
        nav(`/orders/${data.order._id}`);
      } else {
        setStatus("Creating Stripe checkout…");
        const data = await createStripeSession(token, addr);
        window.location.href = data.url;
      }
    } catch (e) {
      setErr(e.message || "Checkout failed");
      setStatus("");
    }
  }

  return (
    <div className="cartWrap">
      <div className="form" style={{ flex: 1, maxWidth: "unset" }}>
        <div className="title" style={{ marginTop: 0 }}>
          Checkout
        </div>
        <div className="small">
          Enter delivery address and choose payment.
        </div>
        <div className="hr" />

        <input
          className="input"
          placeholder="Full name"
          value={addr.fullName}
          onChange={(e) =>
            setAddr((a) => ({ ...a, fullName: e.target.value }))
          }
        />
        <div style={{ height: 10 }} />

        <input
          className="input"
          placeholder="Phone"
          value={addr.phone}
          onChange={(e) =>
            setAddr((a) => ({ ...a, phone: e.target.value }))
          }
        />
        <div style={{ height: 10 }} />

        <input
          className="input"
          placeholder="Address line 1"
          value={addr.line1}
          onChange={(e) =>
            setAddr((a) => ({ ...a, line1: e.target.value }))
          }
        />
        <div style={{ height: 10 }} />

        <input
          className="input"
          placeholder="Address line 2 (optional)"
          value={addr.line2}
          onChange={(e) =>
            setAddr((a) => ({ ...a, line2: e.target.value }))
          }
        />
        <div style={{ height: 10 }} />

        <div className="kv">
          <input
            className="input"
            placeholder="City"
            value={addr.city}
            onChange={(e) =>
              setAddr((a) => ({ ...a, city: e.target.value }))
            }
          />
          <input
            className="input"
            placeholder="State"
            value={addr.state}
            onChange={(e) =>
              setAddr((a) => ({ ...a, state: e.target.value }))
            }
          />
        </div>

        <div style={{ height: 10 }} />

        <div className="kv">
          <input
            className="input"
            placeholder="Pincode"
            value={addr.pincode}
            onChange={(e) =>
              setAddr((a) => ({ ...a, pincode: e.target.value }))
            }
          />
          <input
            className="input"
            placeholder="Country"
            value={addr.country}
            onChange={(e) =>
              setAddr((a) => ({ ...a, country: e.target.value }))
            }
          />
        </div>

        <div className="hr" />
        <div className="small">Payment method</div>

        <div className="selectRow">
          <button
            className={"choice" + (pm === "COD" ? " active" : "")}
            onClick={() => setPm("COD")}
          >
            Cash on Delivery
          </button>
          <button
            className={"choice" + (pm === "STRIPE" ? " active" : "")}
            onClick={() => setPm("STRIPE")}
          >
            Online (Stripe)
          </button>
        </div>

        {err && <div className="toast small">Error: {err}</div>}
        {status && <div className="toast small">{status}</div>}

        <div className="hr" />
        <button
          className="btn"
          disabled={!canSubmit || cartBusy}
          onClick={placeOrder}
        >
          {pm === "COD" ? "Place COD order" : "Pay with Stripe"}
        </button>

        {!token && (
          <div className="small" style={{ marginTop: 8 }}>
            Login required.
          </div>
        )}
      </div>

      <div className="summary">
        <div className="title" style={{ marginTop: 0 }}>
          Order summary
        </div>
        <div className="hr" />

        {items.length === 0 ? (
          <div className="small">Cart is empty.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id}>
                  <td>
                    <div style={{ fontWeight: 650 }}>
                      {it.titleSnapshot}
                    </div>
                    <div className="small">Size: {it.size}</div>
                    <div className="small">
                      ₹ {it.priceAtAdd} each
                    </div>
                  </td>
                  <td>{it.qty}</td>
                  <td>{money(it.priceAtAdd * it.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="hr" />
        <div className="kv">
          <span className="small">Subtotal</span>
          <b>{money(totals?.subtotal || 0)}</b>
        </div>
        <div className="small" style={{ marginTop: 10 }}>
          Shipping: free (phase demo)
        </div>
      </div>
    </div>
  );
}
