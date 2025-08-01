import { useState } from "react";
import { addToCart } from "../utils/cart.js";

export default function ProductCard({ id, name, price, originalPrice, image, discount, showAddToCart = true, hideDollarSign = false, onClick, onAddToCart }) {
  const [hovered, setHovered] = useState(false);
  const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
    } else {
      addToCart(id, 1);
      alert(`${name} added to cart`);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full mb-4 rounded-md overflow-hidden">
        <img src={image || fallback} alt={name} className="w-full h-64 object-cover rounded-md" />
        {/* Removed discount badge display as per user request */}
        {showAddToCart && (
          <div className={`absolute top-2 right-2 flex flex-col space-y-2 opacity-0 transition-opacity duration-300 ${hovered ? "opacity-100" : ""}`}>
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276a1 1 0 011.447.894v6.764a1 1 0 01-1.447.894L15 14m-6 0l-4.553 2.276A1 1 0 013 14.276v-6.764a1 1 0 011.447-.894L9 10m6 0v4m-6-4v4" />
              </svg>
            </button>
          </div>
        )}
        {showAddToCart && hovered && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-3 font-semibold rounded-b-md shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Add to Cart
          </button>
        )}
      </div>
      <h3 className="text-base font-semibold text-gray-900 w-full hover:text-pink-600 transition-colors duration-300 cursor-pointer">{name}</h3>
      <div className="flex items-center space-x-2 mt-2 w-full">
        <span className="text-orange-500 font-bold">{hideDollarSign ? price : `Rs ${price}`}</span>
        {originalPrice && (
          <span className="text-gray-500 line-through">{hideDollarSign ? originalPrice : `Rs ${originalPrice}`}</span>
        )}
      </div>
    </div>
  );
}
