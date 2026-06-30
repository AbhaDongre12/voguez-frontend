import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { userCartStore } from "../store/CartStore";

import type Product from "../types/product";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const increment = userCartStore((state) => state.increment);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="loading-state">Loading product...</div>;
  }

  const addToCart = async () => {
    try {
      await api.post("/cart/add", {
        productId: product?.id,
        quantity: quantity,
      });
      increment();
      setMessage("Added to Cart!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to add item");
    }
  };

  return (
    <div className="product-detail">
        <div className="product-image">
            <img
                src={`/images/products/${product.imageUrl}`}
                alt={product.name}
                width="400"
            />
      </div>
      <div className="product-info">
      <h1>{product.name}</h1>
      <h2>Rs. {product.price}</h2>
      <p>{product.description}</p>
      <p>Stock: {product.quantity}</p>
      <input
        type="number"
        min="1"
        max={product.quantity}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button className="btn-primary" onClick={addToCart} disabled={product.quantity <= 0}>
        {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
      {message && (
        <p className={message.includes("Failed") ? "error-message" : "success-message"}>
          {message}
        </p>
      )}
      </div>
    </div>
  );
}
