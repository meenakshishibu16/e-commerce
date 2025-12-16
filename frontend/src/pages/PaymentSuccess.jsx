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
  <div className="container">
    <div className="form" style={{maxWidth:560}}>
      <div className="title" style={{marginTop:0}}>Payment success</div>
      <div className="hr" />

      {/* ✅ Success animation */}
      {!err && (
        <div style={{display:"grid", placeItems:"center", padding:"10px 0 18px"}}>
          <div style={{
            width:76, height:76, borderRadius:24,
            background:"linear-gradient(135deg, rgba(24,169,87,.18), rgba(24,169,87,.06))",
            border:"1px solid rgba(24,169,87,.25)",
            display:"grid", placeItems:"center",
            animation:"pop .35s ease both"
          }}>
            <div style={{
              width:46, height:46, borderRadius:18,
              background:"linear-gradient(135deg, #18a957, #2bd56f)",
              color:"#fff",
              display:"grid", placeItems:"center",
              fontSize:28, fontWeight:900,
              boxShadow:"0 14px 30px rgba(24,169,87,.25)",
              animation:"rise .45s ease both"
            }}>✓</div>
          </div>

          <div className="small" style={{marginTop:10, animation:"fadeIn .7s ease .08s both"}}>
            Your order is confirmed. Redirecting…
          </div>

          {/* simple confetti lines */}
          <div aria-hidden style={{position:"relative", width:"100%", height:40, marginTop:8, overflow:"hidden"}}>
            {Array.from({length:18}).map((_,i)=>(
              <span key={i} style={{
                position:"absolute",
                left:`${(i*100)/18}%`,
                top: (i%2? 0: 10),
                width:2,
                height: 24 + (i%4)*6,
                background: i%3===0 ? "rgba(42,109,244,.55)" : i%3===1 ? "rgba(24,169,87,.55)" : "rgba(255,176,32,.55)",
                borderRadius:999,
                transform:`rotate(${(i%5-2)*8}deg)`,
                animation:`fadeIn .45s ease ${(i*0.02)}s both`
              }}/>
            ))}
          </div>
        </div>
      )}

      {status && <div className="toast small">{status}</div>}
      {err && <div className="toast small">Error: {err}</div>}

      <div className="hr" />
      <Link className="pill primary" to="/orders">View orders</Link>
    </div>
  </div>
);

}
