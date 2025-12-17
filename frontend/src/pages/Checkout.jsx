import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCODOrder, createStripeSession } from "../api.js";
import { useAuth } from "../state/AuthContext.jsx";
import { useCart } from "../state/CartContext.jsx";

const money=(n)=>`₹ ${Number(n||0).toFixed(0)}`;

// Simple India-focused validation (works well for your internship demo)
const phoneOk = (p) => /^[6-9]\d{9}$/.test(String(p||"").trim()); // 10-digit Indian mobile
const pinOk = (p) => /^\d{6}$/.test(String(p||"").trim()); // 6-digit PIN

const STATES_INDIA = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu and Kashmir","Ladakh","Puducherry","Chandigarh"
];

export default function Checkout(){
  const nav=useNavigate();
  const {token,user}=useAuth();
  const {cart,totals,loading:cartBusy, clear}=useCart();

  const [pm,setPm]=useState("COD");
  const [status,setStatus]=useState("");
  const [err,setErr]=useState("");

  const [addr,setAddr]=useState({
    fullName:user?.name||"",
    phone:"",
    line1:"",
    line2:"",
    city:"",
    state:"",      // now dropdown
    pincode:"",    // numeric only
    country:"India" // dropdown
  });

  const items=cart?.items||[];

  const canSubmit=useMemo(()=>{
    if(!token) return false;
    if(items.length===0) return false;

    const reqd=["fullName","phone","line1","city","state","pincode","country"];
    if(!reqd.every(k=>String(addr[k]||"").trim().length>0)) return false;

    if(!phoneOk(addr.phone)) return false;
    if(!pinOk(addr.pincode)) return false;

    return true;
  },[token,items.length,addr]);

  async function placeOrder(){
    setErr(""); setStatus("");
    try{
      if(!phoneOk(addr.phone)) throw new Error("Enter a valid 10-digit phone number.");
      if(!pinOk(addr.pincode)) throw new Error("Pincode must be a 6-digit number.");

      if(pm==="COD"){
        setStatus("Placing COD order…");
        const data=await createCODOrder(token, addr);
        setStatus("Order placed!");
        // optional: clear cart after order
        await clear();
        nav(`/orders/${data.order._id}`);
      } else {
        setStatus("Creating Stripe checkout…");
        const data=await createStripeSession(token, addr);
        window.location.href=data.url;
      }
    }catch(e){
      setErr(e.message||"Checkout failed");
      setStatus("");
    }
  }

  return (
    <div className="cartWrap">
      <div className="form" style={{flex:1,maxWidth:"unset"}}>
        <div className="title" style={{marginTop:0}}>Checkout</div>
        <div className="small">Enter delivery address and choose payment.</div>
        <div className="hr" />

        <input className="input" placeholder="Full name"
          value={addr.fullName}
          onChange={e=>setAddr(a=>({...a,fullName:e.target.value}))}
        />
        <div style={{height:10}} />

        <input className="input" placeholder="Phone (10 digits)"
          inputMode="numeric"
          value={addr.phone}
          onChange={e=>{
            const v = e.target.value.replace(/\D/g,"").slice(0,10);
            setAddr(a=>({...a,phone:v}));
          }}
        />
        <div className="small" style={{marginTop:6}}>
          {addr.phone && !phoneOk(addr.phone) ? "Enter a valid Indian mobile number (10 digits)." : "\u00A0"}
        </div>

        <input className="input" placeholder="Address line 1"
          value={addr.line1}
          onChange={e=>setAddr(a=>({...a,line1:e.target.value}))}
        />
        <div style={{height:10}} />
        <input className="input" placeholder="Address line 2 (optional)"
          value={addr.line2}
          onChange={e=>setAddr(a=>({...a,line2:e.target.value}))}
        />

        <div className="hr" />

        <div className="kv">
          <input className="input" placeholder="City"
            value={addr.city}
            onChange={e=>setAddr(a=>({...a,city:e.target.value}))}
          />

          <div style={{height:10}} />

          {/* State dropdown */}
          <select
            className="input"
            value={addr.state}
            onChange={e=>setAddr(a=>({...a,state:e.target.value}))}
          >
            <option value="">Select state</option>
            {STATES_INDIA.map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{height:10}} />

        <div className="kv">
          <input className="input" placeholder="Pincode (6 digits)"
            inputMode="numeric"
            value={addr.pincode}
            onChange={e=>{
              const v = e.target.value.replace(/\D/g,"").slice(0,6);
              setAddr(a=>({...a,pincode:v}));
            }}
          />

          <div style={{height:10}} />

          {/* Country dropdown */}
          <div
            className="input"> India
          </div>
        </div>

        <div className="small" style={{marginTop:6}}>
          {addr.pincode && !pinOk(addr.pincode) ? "Pincode must be exactly 6 digits." : "\u00A0"}
        </div>

        <div className="hr" />

        <div className="small">Payment method</div>
        <div className="selectRow">
          <button className={"choice"+(pm==="COD"?" active":"")} onClick={()=>setPm("COD")} type="button">
            Cash on Delivery
          </button>
          <button className={"choice"+(pm==="STRIPE"?" active":"")} onClick={()=>setPm("STRIPE")} type="button">
            Online (Stripe)
          </button>
        </div>

        {err && <div className="toast small">Error: {err}</div>}
        {status && <div className="toast small">{status}</div>}

        <div className="hr" />
        <button className="btn" disabled={!canSubmit || cartBusy} onClick={placeOrder}>
          {pm==="COD" ? "Place COD order" : "Pay with Stripe"}
        </button>
        {!token && <div className="small" style={{marginTop:8}}>Login required.</div>}
      </div>

      <div style={{height:50}} />

      {/* ✅ Order summary as TABLE */}
      <div className="summary">
        <div className="title" style={{marginTop:0}}>Order summary</div>
        <div className="hr" />

        {items.length===0 ? <div className="small">Cart is empty.</div> : (
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th style={{textAlign:"center"}}>Qty</th>
                <th style={{textAlign:"right"}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it=>(
                <tr key={it._id}>
                  <td>
                    <div style={{fontWeight:400}}>{it.titleSnapshot}</div>
                    <div className="small">Size: {it.size}</div>
                    <div className="small">{money(it.priceAtAdd)} each</div>
                  </td>
                  <td style={{textAlign:"center", fontWeight:400}}>{it.qty}</td>
                  <td style={{textAlign:"right", fontWeight:400}}>{money(it.priceAtAdd*it.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="hr" />
        <div className="kv"><span className="small">Subtotal : </span><b>{money(totals?.subtotal||0)}</b></div>
        <div className="small" style={{marginTop:10}}>Shipping: free (demo)</div>
      </div>
    </div>
  );
}
