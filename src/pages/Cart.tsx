import { useEffect, useState } from "react";
import api from "../services/api";
import { userCartStore } from "../store/CartStore";
import { useNavigate } from "react-router-dom";

import type { CartItem } from "../types/cartitem";

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const setCount = userCartStore((state) => state.setCount);
  const navigate=useNavigate();

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setItems(response.data);
      const totalCount = response.data.reduce(
        (sum:number, item:CartItem) => sum + item.quantity, 0);
      setCount(totalCount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      await api.put("/cart/update", {
        cartItemId,
        quantity,
      });
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await api.delete(`/cart/remove/${id}`);
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="cart-page">
      <h1>My Cart</h1>
      {items.length === 0 ? (
        <div className="empty-state"><p>Your cart is empty.</p></div>
      ) : (
      <>
      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={`/src/assets/images/products/${item.product.imageUrl}`} width="100" alt={item.product.name} />
          <div className="cart-info">
          <h3>{item.product.name}</h3>
          <p>Rs. {item.product.price}</p>
          <div className="quantity-controls">
          <button className="btn-outline btn-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
            -
          </button>
          <span>{item.quantity}</span>
          <button className="btn-outline btn-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            +
          </button>
          </div>
          <button className="btn-danger btn-sm" onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        </div>
      ))}
      <div className="order-summary">
        <h2>Order Summary</h2>
        <p>Total: Rs. {total}</p>
        <button className="btn-primary" onClick={()=>navigate("/checkout")}>Checkout</button>
      </div>
      </>
      )}
    </div>
  );
}
