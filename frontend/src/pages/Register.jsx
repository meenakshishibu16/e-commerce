import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Register(){
  const nav=useNavigate();
  const {register,loading}=useAuth();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");

  async function onSubmit(e){
    e.preventDefault();
    setErr("");
    try{await register({name,email,password}); nav("/");}
    catch(e){setErr(e.message||"Register failed");}
  }

  return (
    <div className="form">
      <div className="title" style={{marginTop:0}}>Register</div>
      <div className="small">Create an account for checkout.</div>
      <div className="hr" />
      <form onSubmit={onSubmit}>
        <input className="input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <div style={{height:10}} />
        <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <div style={{height:10}} />
        <input className="input" placeholder="Password (min 6)" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <div className="hr" />
        {err && <div className="small">Error: {err}</div>}
        <button className="btn" disabled={loading||!name||!email||password.length<6} type="submit">{loading?"Creating…":"Create account"}</button>
      </form>
      <div className="hr" />
      <div className="small">Already have an account? <Link to="/login">Login</Link></div>
    </div>
  );
}
