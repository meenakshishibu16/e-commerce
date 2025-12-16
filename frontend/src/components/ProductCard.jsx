import { Link } from "react-router-dom";

export default function ProductCard({ product }){
  return (
    <Link to={`/product/${product._id}`} className="card">
      <img
        className="cardImg"
        src={product.imageUrl || "https://picsum.photos/seed/placeholder/600/600"}
        alt={product.title}
        loading="lazy"
      />
      <div className="cardBody">
        <div className="cardRow">
          <h3 className="cardTitle">{product.title}</h3>
          <span className="tag">{product.category || "Store"}</span>
        </div>
        <div className="cardRow">
          <div className="price">₹ {product.price}</div>
          <span className="small">Tap to view</span>
        </div>
      </div>
    </Link>
  );
}
