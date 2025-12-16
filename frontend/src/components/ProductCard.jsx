import { Link } from "react-router-dom";
export default function ProductCard({product}){
  return (
    <Link to={`/product/${product._id}`} className="card">
      <img src={product.imageUrl || "https://picsum.photos/seed/placeholder/800/800"} alt={product.title} />
      <div className="p">
        <div className="small">{product.category}</div>
        <div className="title">{product.title}</div>
        <div className="price">₹ {product.price}</div>
      </div>
    </Link>
  );
}
