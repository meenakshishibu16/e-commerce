import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import { useCart } from "./state/CartContext.jsx";

export default function App() {
  const { totals } = useCart();

  return (
    <div className="container">
      <div className="nav">
        <Link className="brand" to="/">FOREVER • Phase 2</Link>
        <div className="navRight">
          <Link className="pill" to="/cart">Cart ({totals?.itemCount || 0})</Link>
          <span className="badge">Variants + Cart</span>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      <div className="footer">Phase 2: size variants + cart (cartId in localStorage)</div>
    </div>
  );
}
