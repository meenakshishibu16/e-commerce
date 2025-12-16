import { Link } from "react-router-dom";
export default function PaymentCancel(){
  return (
    <div className="form">
      <div className="title" style={{marginTop:0}}>Payment cancelled</div>
      <div className="small">No worries — your cart is still available.</div>
      <div className="hr" />
      <Link className="pill" to="/checkout">Back to checkout</Link>
      <Link className="pill" style={{marginLeft:8}} to="/cart">Back to cart</Link>
    </div>
  );
}
