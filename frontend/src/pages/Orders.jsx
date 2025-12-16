import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders } from "../api.js";
import { useAuth } from "../state/AuthContext.jsx";
const money=(n)=>`₹ ${Number(n||0).toFixed(0)}`;

export default function Orders(){
  const {token}=useAuth();
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState("");

  useEffect(()=>{let mounted=true;(async()=>{
    try{
      if(!token){setLoading(false); return;}
      const data=await listOrders(token);
      if(!mounted) return;
      setOrders(data.orders||[]);
    }catch(e){if(mounted) setErr(e.message||"Failed");}
    finally{if(mounted) setLoading(false);}
  })(); return ()=>{mounted=false};},[token]);

  if(!token) return <div className="small">Login to view orders.</div>;

  return (
    <div>
      <div className="title">My Orders</div>
      <div className="hr" />
      {loading && <div className="small">Loading…</div>}
      {err && <div className="small">Error: {err}</div>}
      {!loading && !err && orders.length===0 && <div className="small">No orders yet.</div>}
      {!loading && !err && orders.length>0 && (
        <table className="table">
          <thead><tr><th>Order</th><th>Payment</th><th>Status</th><th>Amount</th><th>Placed</th></tr></thead>
          <tbody>
            {orders.map(o=>(
              <tr key={o._id}>
                <td><Link to={`/orders/${o._id}`} className="pill">View</Link></td>
                <td>{o.paymentMethod} / {o.paymentStatus}</td>
                <td>{o.orderStatus}</td>
                <td>{money(o.subtotal)}</td>
                <td className="small">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
