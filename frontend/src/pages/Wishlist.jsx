import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../api";
import { useAuth } from "../state/AuthContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getWishlist(token)
      .then((data) => setWishlist(data.wishlist))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return <p>Please login to view wishlist.</p>;
  if (loading) return <p>Loading wishlist...</p>;

  return (
    <div>
      <h2>My Wishlist</h2>

      {wishlist.length === 0 && <p>No items in wishlist.</p>}

      <div className="grid">
        {wishlist.map((product) => (
          <div key={product._id}>
            <ProductCard product={product} />
            <button
              className="btn"
              onClick={() =>
                removeFromWishlist(token, product._id).then((data) =>
                  setWishlist(data.wishlist)
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
