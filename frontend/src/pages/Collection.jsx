import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Collection(){
  const [products,setProducts]=useState([]);
  const [q,setQ]=useState("");
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState("");

  useEffect(()=>{let mounted=true;(async()=>{
    try{
      setLoading(true);
      const data = await fetchProducts();
      if(!mounted) return;
      setProducts(data);
    }catch(e){ if(mounted) setErr(e.message||"Failed"); }
    finally{ if(mounted) setLoading(false); }
  })(); return ()=>{mounted=false};},[]);

  const filtered = useMemo(()=>{
    const s=q.trim().toLowerCase();
    if(!s) return products;
    return products.filter(p =>
      (p.title||"").toLowerCase().includes(s) ||
      (p.category||"").toLowerCase().includes(s)
    );
  },[products,q]);

  return (
    <div>
      <div className="sectionTitle">Collection</div>
      <div className="sectionSub">
        Explore the full catalog. Click a product to view details, choose size, quantity, wishlist, and reviews.
      </div>

      <div className="topbar">
        <div style={{flex:1}}>
          <input className="input" placeholder="Search products…" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
        <span className="tag">{filtered.length} items</span>
      </div>

      {loading && <div className="small">Loading…</div>}
      {err && <div className="panel small">Error: {err}</div>}

      <div className="grid">
        {filtered.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
