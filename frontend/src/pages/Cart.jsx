import { Link } from "react-router-dom";
import { useCart } from "../state/CartContext.jsx";

const money = (n) => `₹ ${Number(n || 0).toFixed(0)}`;

export default function Cart() {
  const { cart, totals, loading, setQty, remove, clear } = useCart();
  const items = cart?.items || [];

  return (
    <div>
      <Link className="small" to="/">← Continue shopping</Link>
      <div className="hr" />
      {loading && <div className="small">Updating cart…</div>}

      <div className="cartWrap">
        <div className="cartList">
          {items.length === 0 && <div className="small">Your cart is empty.</div>}
          {items.map(it => (
            <div className="cartItem" key={it._id}>
              <img src={it.imageUrlSnapshot || "https://picsum.photos/seed/placeholder/800/800"} alt={it.titleSnapshot} />
              <div className="cartMeta">
                <div className="title" style={{ margin:0 }}>{it.titleSnapshot}</div>
                <div className="small">Size: {it.size}</div>
                <div className="small">Price: {money(it.priceAtAdd)}</div>
                <div className="cartActions" style={{ marginTop:10 }}>
                  <button className="qtyBtn" onClick={() => setQty(it._id, Math.max(1, (it.qty||1)-1))}>−</button>
                  <div className="pill">Qty: {it.qty}</div>
                  <button className="qtyBtn" onClick={() => setQty(it._id, (it.qty||1)+1)}>+</button>
                  <button className="btn" style={{ marginLeft:"auto" }} onClick={() => remove(it._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="summary">
          <div className="title" style={{ marginTop:0 }}>Summary</div>
          <div className="hr" />
          <div className="small">Items: {totals?.itemCount || 0}</div>
          <div style={{ marginTop:6 }}>Subtotal: <b>{money(totals?.subtotal || 0)}</b></div>
          <div className="hr" />
          <button className="btn" disabled={items.length===0 || loading} onClick={clear}>Clear cart</button>
          <div className="hr" />
          <div className="small">Next: checkout + COD + Stripe.</div>
        </div>
      </div>
    </div>
  );
}
