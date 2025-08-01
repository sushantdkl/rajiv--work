import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./Productcard";
import { getProducts } from "../service/productApi.js";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const productsToShow = showAll ? products : products.slice(0, 4);

  const handleAddToCart = (id) => {
    import("../utils/cart.js").then(({ addToCart }) => {
      addToCart(id, 1);
      alert("Product added to cart");
    });
  };

  const handleProductClick = (id) => {
    navigate(`/productdetails/${id}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }
  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular safety equipment
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
          {productsToShow.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              image={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`) : ''}
              onAddToCart={() => handleAddToCart(product.id)}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {showAll ? "Show Less" : "View All Products"}
          </button>
        </div>
      </div>
    </section>
  );
}
