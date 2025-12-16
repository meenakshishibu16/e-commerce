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
          {/* Left: Logo */}
          <Link className="brand" to="/">
            FOREVER <span className="brandDot" />
          </Link>

          {/* Center: Links */}
          <nav className="navMid">
            <Link className={`navLink ${activeHome ? "active" : ""}`} to="/">HOME</Link>
            <Link className={`navLink ${activeCol ? "active" : ""}`} to="/collection">COLLECTION</Link>
            <Link className={`navLink ${activeAbout ? "active" : ""}`} to="/about">ABOUT</Link>
            <Link className={`navLink ${activeContact ? "active" : ""}`} to="/contact">CONTACT</Link>
          </nav>

          {/* Right: Icons */}
          <div className="navRight">
            {/* User */}
            {!user ? (
              <Link className="iconBtn" to="/login" title="Account">
                <span style={{fontSize:18}}>👤</span>
              </Link>
            ) : (
              <button className="iconBtn" onClick={logout} title={`Logout (${user.name})`}>
                <span style={{fontSize:18}}>⎋</span>
              </button>
            )}

            {/* Wishlist */}
            <Link className="iconBtn" to="/wishlist" title="Wishlist">
              <span style={{fontSize:18}}>♡</span>
            </Link>

            {/* Cart */}
            <Link className="iconBtn cartBadge" to="/cart" title="Cart">
              <span style={{fontSize:18}}>🛍</span>
              <span className="cartCount">{count}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <Routes>
          {/* NEW PAGES */}
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Existing shop flow */}
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        <div className="footer">
          © {new Date().getFullYear()} FOREVER — Ultimate e-commerce store
        </div>
      </main>
    </>
  );
}
