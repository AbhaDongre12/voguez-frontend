import React, { useState } from "react";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { notify } from "../utils/notify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      login(response.data.token, response.data.user);
      notify.success("Login successful!");
      if (response.data.user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      notify.error("Login failed");
    }
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>
        <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>
        <button type="submit" className="btn-primary">Login</button>
        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
      </form>
    </div>
  );
}
