import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

import type Product from "../types/product";
import type Category from "../types/category";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [category, setCategory] = useState(() => searchParams.get("category") ?? "");
  const [sort, setSort] = useState(() => searchParams.get("sort") ?? "");


  const selectedCategoryId = useMemo(() => {
    if (!category) return "";
    if (/^\d+$/.test(category)) return category;
    const matched = categories.find(
      (cat) => cat.name.trim().toLowerCase() === category.trim().toLowerCase(),
    );
    return matched ? matched.id.toString() : "";
  }, [categories, category]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [category, search, sort, setSearchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          `/product?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}&sort=${encodeURIComponent(sort)}`,
        );
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [search, category, sort]);

  return (
    <div className="products-page">
      <h1>Products</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={selectedCategoryId} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="priceAsc">Price Low → High</option>
          <option value="priceDesc">Price High → Low</option>
        </select>
      </div>
      {products.length === 0 ? (
        <div className="no-results">No products found.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}