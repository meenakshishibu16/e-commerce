import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { confirmStripe } from "../api.js";
import { useAuth } from "../state/AuthContext.jsx";
import { useCart } from "../state/CartContext.jsx"; // ✅ ADD THIS

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") || "";
  const { token } = useAuth();
  const { clear } = useCart(); // ✅ ADD THIS
  const nav = useNavigate();

  const [status, setStatus] = useState("Confirming payment…");
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!token) throw new Error("Login required to confirm payment");
        if (!sessionId) throw new Error("Missing session_id");

        const data = await confirmStripe(token, sessionId);
        if (!mounted) return;

        setStatus(`Payment status: ${data.status}`);

        if (data.order?._id && data.status === "PAID") {
          // ✅ CLEAR CART AFTER PAYMENT SUCCESS
          await clear();

          setTimeout(() => {
            nav(`/orders/${data.order._id}`);
          }, 800);
        }
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || "Failed");
        setStatus("");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token, sessionId, nav, clear]);

  return (
    <div className="form">
      <div className="title" style={{ marginTop: 0 }}>
        Payment success
      </div>

      <div className="hr" />

      {status && <div className="toast small">{status}</div>}
      {err && <div className="toast small">Error: {err}</div>}

      <div className="hr" />
      <Link className="pill" to="/orders">
        Go to orders
      </Link>
    </div>
  );
}
