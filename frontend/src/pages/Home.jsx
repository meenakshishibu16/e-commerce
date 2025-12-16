import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { fetchProducts } from "../api.js";

export default function Home(){
  const [products,setProducts]=useState([]);
  const [q,setQ]=useState("");
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState("");

  useEffect(()=>{let mounted=true;(async()=>{
    try{setLoading(true); const data=await fetchProducts(); if(mounted) setProducts(data);}
    catch(e){if(mounted) setErr(e.message||"Error");}
    finally{if(mounted) setLoading(false);}
  })(); return ()=>{mounted=false};},[]);

  const filtered=useMemo(()=>{
    const s=q.trim().toLowerCase();
    if(!s) return products;
    return products.filter(p => (p.title||"").toLowerCase().includes(s) || (p.category||"").toLowerCase().includes(s) || (p.description||"").toLowerCase().includes(s));
  },[products,q]);

  return (
    <div>
      <input className="input" placeholder="Search products…" value={q} onChange={(e)=>setQ(e.target.value)} />
      <div className="hr" />
      {loading && <div className="small">Loading products…</div>}
      {err && <div className="small">Error: {err}</div>}
      {!loading && !err && <div className="grid">{filtered.map(p => <ProductCard key={p._id} product={p} />)}</div>}
    </div>
  );
}
