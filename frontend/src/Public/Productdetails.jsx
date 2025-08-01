
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { getProductById } from '../service/productApi.js';
import { AuthContext } from '../context/AuthContext.jsx';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("black");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Add to cart function
  const addToCart = (buyNow = false) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const cartItem = {
      productId: product.id,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor
    };

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(
      item => item.productId === product.id
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));

    if (buyNow) {
      // Navigate to cart page when Buy Now is clicked
      navigate('/cart');
    } else {
      // Show success message or update cart icon for Add to Cart
      alert('Product added to cart!');
    }
  };

  const handleBuyNow = () => {
    addToCart(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { name: "black", color: "bg-black" },
    { name: "red", color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-white">
     
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-sm text-gray-500">
          <span className="hover:text-red-600 cursor-pointer transition-colors">Home</span>
          <span className="mx-2">/</span>
          <span className="text-black">product</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Product Image */} 
          <div className="h-[400px] sm:h-[450px] md:h-[500px] lg:h-[520px] bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`) : ''}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(70 Reviews)</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">Rs {product.price}</div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Colours:</h3>
              <div className="flex space-x-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name ? "border-gray-900 scale-110" : "border-gray-300"
                    } ${color.color}`}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size:</h3>
              <div className="flex space-x-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Buy Now */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button 
                onClick={handleBuyNow}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-md transition-colors"
              >
                Buy Now
              </button>
              <button 
                onClick={() => addToCart(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-2 rounded-md transition-colors border"
              >
                Add to Cart
              </button>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 mt-1 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Free Delivery</h4>
                  <p className="text-sm text-gray-600">Enter your postal code for Delivery Availability</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RotateCcw className="h-5 w-5 mt-1 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Return Delivery</h4>
                  <p className="text-sm text-gray-600">Free 30 Days Delivery Returns. Details</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
