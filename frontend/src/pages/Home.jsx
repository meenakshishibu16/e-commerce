import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";
import { Link } from "react-router-dom";

const HERO_IMG = "https://i.mdel.net/i/db/thumbs/mdx/1000x/2025/11/009_2592_V4_HR_COVER_MDC.jpg";

export default function Home(){
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
      {/* Hero like reference */}
      <div className="heroWrap">
        <div className="heroGrid">
          <div className="heroLeft">
            <div className="heroKicker">
              <span className="heroLine" />
              OUR BESTSELLERS
            </div>

            <h1 className="heroTitle">Latest Arrivals</h1>

            <div className="heroCtaRow">
              <Link className="shopNow" to="/collection">
                SHOP NOW <span className="shopLine" />
              </Link>
            </div>

            <div className="small" style={{maxWidth:520, lineHeight:1.7}}>
              Discover curated essentials in a clean, minimal storefront. Wishlist your favorites,
              add quantity, checkout with COD or Stripe, and leave verified reviews.
            </div>
          </div>

          <div className="heroRight">
            <img className="heroImg" src={HERO_IMG} alt="UrbanClick.co hero" />
          </div>
        </div>
      </div>

      {/* Products preview */}
      <div className="sectionTitle">Our Collection</div>
      <div className="sectionSub">
        Browse products below or go to Collection for the full catalog.
      </div>

      <div className="topbar">
        <div style={{flex:1}}>
          <input
            className="input"
            placeholder="Search products (name, category)…"
            value={q}
            onChange={e=>setQ(e.target.value)}
          />
        </div>
        <span className="tag">{filtered.length} items</span>
      </div>

      {loading && <div className="small">Loading…</div>}
      {err && <div className="panel small">Error: {err}</div>}

      <div className="grid">
        {filtered.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
      </div>

      <div style={{display:"flex", justifyContent:"center", marginTop:18}}>
        <Link className="pill" to="/collection">View full collection →</Link>
      </div>
    </div>
  );
}
