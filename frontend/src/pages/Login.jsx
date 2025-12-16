import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { useCart } from "../state/CartContext.jsx";

export default function Login(){
  const nav=useNavigate();
  const {login,loading}=useAuth();
  const {guestCartId}=useCart();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");

  async function onSubmit(e){
    e.preventDefault();
    setErr("");
    try{await login({email,password,guestCartId:guestCartId||undefined}); nav("/");}
    catch(e){setErr(e.message||"Login failed");}
  }

  return (
    <div className="form">
      <div className="title" style={{marginTop:0}}>Login</div>
      <div className="small">Login to checkout and view orders.</div>
      <div className="hr" />
      <form onSubmit={onSubmit}>
        <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <div style={{height:10}} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <div className="hr" />
        {err && <div className="small">Error: {err}</div>}
        <button className="btn" disabled={loading||!email||!password} type="submit">{loading?"Logging in…":"Login"}</button>
      </form>
      <div className="hr" />
      <div className="small">No account? <Link to="/register">Register</Link></div>
    </div>
  );
}
