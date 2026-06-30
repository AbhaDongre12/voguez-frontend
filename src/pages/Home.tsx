import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

import type Product from "../types/product";
import type Category from "../types/category";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/category");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTrendingProducts = async () => {
    try {
      const response = await api.get("/product");
      setTrending(response.data.slice(0, 4));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTrendingProducts();
  }, []);

  return (
    <div>
      {/*HERO*/}
      <section className="hero">
        <h1>Fashion for Everyone</h1>
        <p>Discover the latest fashion trends!</p>
        <Link to="/products">Shop Now</Link>
      </section>
      {/*CATEGORIES*/}
      <section>
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="category-card"
            >
              <img src={`/images/categories/${category.imageUrl}`} alt={category.name} />
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>
      {/*TRENDING*/}
      <section>
        <h2>Trending Products</h2>
        <div className="product-grid">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
