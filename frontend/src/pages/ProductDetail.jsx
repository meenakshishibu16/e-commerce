import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../api.js";
import { useCart } from "../state/CartContext.jsx";
import Reviews from "../components/Reviews";
import { addToWishlist, removeFromWishlist, getWishlist } from "../api.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem, loading: cartBusy } = useCart();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ Wishlist state
  const [inWishlist, setInWishlist] = useState(false);

  // ✅ Quantity + added state
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Fetch product
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        if (!mounted) return;

        setProduct(data);
        const first = (data.sizes || []).find((s) => (s.stock ?? 0) > 0);
        setSelectedSize(first?.size || data.sizes?.[0]?.size || "");
      } catch (e) {
        if (mounted) setErr(e.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    if (!token || !product) return;

    getWishlist(token).then((data) => {
      const exists = data.wishlist.some((p) => p._id === product._id);
      setInWishlist(exists);
    });
  }, [token, product]);

  // Reset qty & button when size or product changes
  useEffect(() => {
    setQty(1);
    setAdded(false);
  }, [selectedSize, product?._id]);

  async function toggleWishlist() {
    if (!token || !product) return;

    if (inWishlist) {
      await removeFromWishlist(token, product._id);
      setInWishlist(false);
    } else {
      await addToWishlist(token, product._id);
      setInWishlist(true);
    }
  }

  const sizeChoices = useMemo(
    () =>
      (product?.sizes || []).map((s) => ({
        size: s.size,
        stock: s.stock ?? 0,
        disabled: (s.stock ?? 0) <= 0,
      })),
    [product]
  );

  if (loading) return <div className="small">Loading…</div>;
  if (err) return <div className="small">Error: {err}</div>;
  if (!product) return <div className="small">Not found.</div>;

  return (
    <div>
      <Link className="small" to="/">← Back</Link>
      <div className="hr" />

      <div className="row">
        <img
          className="detail-img"
          src={product.imageUrl || "https://picsum.photos/seed/placeholder/800/800"}
          alt={product.title}
        />

        <div className="panel">
          <div className="small">{product.category}</div>
          <h2 style={{ margin: "6px 0" }}>{product.title}</h2>
          <div className="price">₹ {product.price}</div>

          <div className="hr" />
          <div style={{ lineHeight: 1.5, opacity: 0.9 }}>
            {product.description}
          </div>

          <div className="hr" />
          <div className="small">Select size</div>

          <div className="selectRow">
            {sizeChoices.map((ch) => (
              <button
                key={ch.size}
                className={
                  "choice" +
                  (selectedSize === ch.size ? " active" : "") +
                  (ch.disabled ? " disabled" : "")
                }
                disabled={ch.disabled}
                onClick={() => setSelectedSize(ch.size)}
              >
                {ch.size} {ch.disabled ? "(out)" : ""}
              </button>
            ))}
          </div>

          {/* ✅ Quantity selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: "12px 0",
            }}
          >
            <button
              className="qtyBtn"
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>

            <span style={{ minWidth: "24px", textAlign: "center" }}>{qty}</span>

            <button
              className="qtyBtn"
              onClick={() => setQty((q) => q + 1)}
            >
              +
            </button>
          </div>

          {/* ✅ Add to cart */}
          <button
            className="btn"
            disabled={!selectedSize || cartBusy || added}
            onClick={async () => {
              await addItem(product._id, selectedSize, qty);
              setAdded(true);
            }}
          >
            {cartBusy
              ? "Adding…"
              : added
              ? "Added to Cart"
              : "Add to Cart"}
          </button>

          {/* ✅ Wishlist toggle */}
          {token && (
            <button
              className="btn"
              style={{
                marginTop: "8px",
                background: inWishlist ? "#ffe6e6" : "#f5f5f5",
                color: inWishlist ? "#c00" : "#333",
              }}
              onClick={toggleWishlist}
            >
              {inWishlist ? "❤️ Added to Wishlist" : "🤍 Add to Wishlist"}
            </button>
          )}
        </div>
      </div>

      <div className="hr" />
      <Reviews productId={product._id} />
    </div>
  );
}
