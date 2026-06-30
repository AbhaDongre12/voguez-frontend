import { Link } from "react-router-dom";
import { userCartStore } from "../store/CartStore";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.svg";

export default function Navbar() {
  const count = userCartStore((state) => state.count);
  const token = localStorage.getItem("token");

  return (
    <nav className="navbar">
      <div className="navbar-left">
      <Link to="/"><img src={logo} alt="logo" className="logo" /></Link>
      <Link to="/products">Products</Link>
      </div>
      {token ? (
        <>
          <Link to="/cart">Cart ({count})</Link>
          <Link to="/order">Orders</Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
          <Link to="/profile">
            <FaUserCircle size={28} />
          </Link>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
