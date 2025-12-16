import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentCancel from "./pages/PaymentCancel.jsx";
import { useCart } from "./state/CartContext.jsx";
import { useAuth } from "./state/AuthContext.jsx";
import Wishlist from "./pages/Wishlist";


export default function App(){
  const {totals}=useCart();
  const {user,logout}=useAuth();

  return (
    <div className="container">
      <div className="nav">
        <Link className="brand" to="/">FOREVER • Phase 4</Link>
        <div className="navRight">
          <Link className="pill" to="/wishlist">Wishlist</Link>
          <Link className="pill" to="/cart">Cart ({totals?.itemCount||0})</Link>
          {!user ? (
            <>
              <Link className="pill" to="/login">Login</Link>
              <Link className="pill" to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link className="pill" to="/orders">My Orders</Link>
              <span className="pill">Hi, {user.name}</span>
              <button className="pill" style={{cursor:"pointer"}} onClick={logout}>Logout</button>
            </>
          )}
          <span className="badge">Checkout + Orders</span>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/product/:id" element={<ProductDetail/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/orders/:id" element={<OrderDetail/>} />
        <Route path="/payment/success" element={<PaymentSuccess/>} />
        <Route path="/payment/cancel" element={<PaymentCancel/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>

      <div className="footer">Phase 4: COD + Stripe checkout + orders.</div>
    </div>
  );
}
