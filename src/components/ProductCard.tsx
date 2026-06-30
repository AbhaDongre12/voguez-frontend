import type Product from "../types/product";
import { Link } from "react-router-dom";

interface Props{
    product:Product;
}

export default function ProductCard({product}:Props){
    return (
        <Link to={`/products/${product.id}`}>
            <div className="product-card">
                <img src={product.imageUrl} alt={product.name} width="200"/>
                <h3>{product.name}</h3>
                <p>Rs. {product.price}</p>
                <button>Add to Cart</button>
            </div>
        </Link>
    );
}