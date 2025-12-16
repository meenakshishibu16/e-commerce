import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../api.js";
import { useAuth } from "../state/AuthContext.jsx";
const money=(n)=>`₹ ${Number(n||0).toFixed(0)}`;

export default function OrderDetail(){
  const {id}=useParams();
  const {token}=useAuth();
  const [order,setOrder]=useState(null);
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState("");

  useEffect(()=>{let mounted=true;(async()=>{
    try{
      if(!token){setLoading(false); return;}
      const data=await getOrder(token,id);
      if(!mounted) return;
      setOrder(data.order);
    }catch(e){if(mounted) setErr(e.message||"Failed");}
    finally{if(mounted) setLoading(false);}
  })(); return ()=>{mounted=false};},[token,id]);

  if(!token) return <div className="small">Login to view this order.</div>;
  if(loading) return <div className="small">Loading…</div>;
  if(err) return <div className="small">Error: {err}</div>;
  if(!order) return <div className="small">Order not found.</div>;
  const a=order.shippingAddress;

  return (
    <div>
      <Link className="small" to="/orders">← Back to orders</Link>
      <div className="hr" />
      <div className="cartWrap">
        <div className="summary" style={{flex:1,width:"unset"}}>
          <div className="title" style={{marginTop:0}}>Order</div>
          <div className="small">ID: {order._id}</div>
          <div className="hr" />
          <div className="kv"><span className="small">Payment</span><b>{order.paymentMethod} / {order.paymentStatus}</b></div>
          <div className="kv" style={{marginTop:8}}><span className="small">Status</span><b>{order.orderStatus}</b></div>
          <div className="kv" style={{marginTop:8}}><span className="small">Subtotal</span><b>{money(order.subtotal)}</b></div>
          {order.stripeSessionId && <div className="small" style={{marginTop:8}}>Stripe session: {order.stripeSessionId}</div>}
        </div>
        <div className="summary">
          <div className="title" style={{marginTop:0}}>Delivery address</div>
          <div className="hr" />
          <div><b>{a.fullName}</b></div>
          <div className="small">{a.phone}</div>
          <div className="small">{a.line1}</div>
          {a.line2 && <div className="small">{a.line2}</div>}
          <div className="small">{a.city}, {a.state} {a.pincode}</div>
          <div className="small">{a.country}</div>
        </div>
      </div>
      <div className="hr" />
      <div className="title">Items</div>
      <div className="hr" />
      <table className="table">
        <thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
        <tbody>
          {order.items.map((it,idx)=>(
            <tr key={idx}>
              <td>
                <div style={{fontWeight:650}}>{it.title}</div>
                <div className="small">Size: {it.size}</div>
                <div className="small">₹ {it.price} each</div>
              </td>
              <td>{it.qty}</td>
              <td>{money(it.price*it.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
