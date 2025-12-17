import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Collection from "./pages/Collection.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentCancel from "./pages/PaymentCancel.jsx";
import Wishlist from "./pages/Wishlist.jsx";

import { useCart } from "./state/CartContext.jsx";
import { useAuth } from "./state/AuthContext.jsx";

function useActive(path){
  const { pathname } = useLocation();
  return pathname === path || (path !== "/" && pathname.startsWith(path));
}

export default function App() {
  const { totals } = useCart();
  const { user, logout } = useAuth();

  const count = totals?.itemCount || 0;

  const activeHome = useActive("/");
  const activeCol = useActive("/collection");
  const activeAbout = useActive("/about");
  const activeContact = useActive("/contact");

  return (
    <>
      <header className="nav">
        <div className="navInner">
          <Link className="brand" to="/">
            UrbanClick.co
          </Link>

          <nav className="navMid">
            <Link className={`navLink ${activeHome ? "active" : ""}`} to="/">HOME</Link>
            <Link className={`navLink ${activeCol ? "active" : ""}`} to="/collection">COLLECTION</Link>
            <Link className={`navLink ${activeAbout ? "active" : ""}`} to="/about">ABOUT</Link>
            <Link className={`navLink ${activeContact ? "active" : ""}`} to="/contact">CONTACT</Link>
          </nav>

          <div className="navRight">
            {/* Orders icon */}
            <Link className="iconBtn" to="/orders" title="Orders">
              <span style={{fontSize:18}}>📦</span>
            </Link>

            {!user ? (
              <Link className="iconBtn" to="/login" title="Account">
                <span style={{fontSize:18}}>👤</span>
              </Link>
            ) : (
              <button className="iconBtn" onClick={logout} title={`Logout (${user.name})`}>
                <span style={{fontSize:18}}>⎋</span>
              </button>
            )}

            <Link className="iconBtn" to="/wishlist" title="Wishlist">
              <span style={{fontSize:18}}>♡</span>
            </Link>

            <Link className="iconBtn cartBadge" to="/cart" title="Cart">
              <span style={{fontSize:18}}>🛍</span>
              <span className="cartCount">{count}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />

          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        <div className="footer">
          © {new Date().getFullYear()} URBANCLICK.CO — Minimal e-commerce demo
        </div>
      </main>
    </>
  );
}
