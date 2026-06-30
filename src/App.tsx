import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import api from "./services/api";
import { userCartStore } from "./store/CartStore";
import AIWidget from "./components/AIWidget";
import { useLocation } from "react-router-dom";

function App() {
  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await api.get("/cart");
        const total = response.data.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0,
        );
        userCartStore.getState().setCount(total);
      } catch (error) {
        console.error(error);
      }
    };
    loadCart();
  }, []);

  const location=useLocation();

  const hideWidget=
    location.pathname==="/login"||
    location.pathname==="/register"||
    location.pathname.startsWith("/admin");

  return (
    <div className="main-content">
      <AppRoutes />
      {!hideWidget && <AIWidget/>}
    </div>);
}

export default App;
