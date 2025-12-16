import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../api.js";
import { useCart } from "../state/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem, loading: cartBusy } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        if (!mounted) return;
        setProduct(data);
        const first = (data.sizes || []).find(s => (s.stock ?? 0) > 0);
        setSelectedSize(first?.size || (data.sizes?.[0]?.size || ""));
      } catch (e) { if (mounted) setErr(e.message || "Error"); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [id]);

  const sizeChoices = useMemo(() => (product?.sizes || []).map(s => ({
    size: s.size, stock: s.stock ?? 0, disabled: (s.stock ?? 0) <= 0
  })), [product]);

  if (loading) return <div className="small">Loading…</div>;
  if (err) return <div className="small">Error: {err}</div>;
  if (!product) return <div className="small">Not found.</div>;

  return (
    <div>
      <Link className="small" to="/">← Back</Link>
      <div className="hr" />
      <div className="row">
        <img className="detail-img" src={product.imageUrl || "https://picsum.photos/seed/placeholder/800/800"} alt={product.title} />
        <div className="panel">
          <div className="small">{product.category}</div>
          <h2 style={{ margin:"6px 0" }}>{product.title}</h2>
          <div className="price">₹ {product.price}</div>
          <div className="hr" />
          <div style={{ lineHeight:1.5, opacity:.9 }}>{product.description}</div>

          <div className="hr" />
          <div className="small">Select size</div>
          <div className="selectRow">
            {sizeChoices.map(ch => (
              <button
                key={ch.size}
                className={"choice" + (selectedSize===ch.size ? " active" : "") + (ch.disabled ? " disabled" : "")}
                disabled={ch.disabled}
                onClick={() => setSelectedSize(ch.size)}
              >
                {ch.size} {ch.disabled ? "(out)" : ""}
              </button>
            ))}
          </div>

          <button className="btn" disabled={!selectedSize || cartBusy} onClick={() => addItem(product._id, selectedSize, 1)}>
            {cartBusy ? "Adding…" : "Add to cart"}
          </button>

          <div className="hr" />
          <div className="small">Phase 2: size variants + cart. Next: auth + checkout.</div>
        </div>
      </div>
    </div>
  );
}
