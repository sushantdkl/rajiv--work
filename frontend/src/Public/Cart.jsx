"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Heart, ShoppingCart, User, Plus, Minus, Trash2, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Footer from "../component/Footer"
import { getProductById } from "../service/productApi.js"
import { AuthContext } from "../context/AuthContext.jsx"

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [cartItems, setCartItems] = useState([])
  const [quantities, setQuantities] = useState({})
  const [couponCode, setCouponCode] = useState("")

  // Load cart from localStorage and fetch product details
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || []
    async function fetchCartProducts() {
      const products = []
      const qtys = {}
      for (const item of storedCart) {
        try {
          const product = await getProductById(item.productId)
          products.push(product)
          qtys[item.productId] = item.quantity
        } catch (error) {
          console.error("Failed to fetch product", item.productId, error)
        }
      }
      setCartItems(products)
      setQuantities(qtys)
    }
    fetchCartProducts()
  }, [])

  // Update quantity in state and localStorage
  const updateQuantity = (productId, change) => {
    setQuantities((prev) => {
      const newQty = Math.max(0, (prev[productId] || 0) + change)
      const newQuantities = { ...prev, [productId]: newQty }
      updateLocalStorage(newQuantities)
      return newQuantities
    })
  }

  // Remove item from cart
  const removeItem = (productId) => {
    setQuantities((prev) => {
      const newQuantities = { ...prev }
      delete newQuantities[productId]
      updateLocalStorage(newQuantities)
      return newQuantities
    })
    setCartItems((prev) => prev.filter((p) => p.id !== productId))
  }

  // Update localStorage cart data based on quantities
  const updateLocalStorage = (newQuantities) => {
    // Use the keys from newQuantities to build the cart array
    const newCart = Object.keys(newQuantities)
      .filter((productId) => newQuantities[productId] > 0)
      .map((productId) => ({
        productId,
        quantity: newQuantities[productId],
      }))
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, product) => {
    const qty = quantities[product.id] || 0
    return acc + product.price * qty
  }, 0)

  // Handle checkout with authentication check
  const handleCheckout = () => {
    if (!user) {
      alert("Please login to proceed with checkout");
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add some items before checkout.");
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-sm text-gray-500">
          <span className="hover:text-red-600 cursor-pointer transition-colors">Home</span>
          <span className="mx-2">/</span>
          <span className="text-black">Cart</span>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Cart Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex items-center justify-center mr-4">
                          <img src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`) : "/src/assets/icon.png"} alt={product.name} className="h-16 w-16 rounded-lg" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center border border-gray-300 rounded-md w-20">
                        <button onClick={() => updateQuantity(product.id, -1)} className="p-1">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="flex-1 text-center text-sm py-1">
                          {(quantities[product.id] || 0).toString().padStart(2, "0")}
                        </span>
                        <button onClick={() => updateQuantity(product.id, 1)} className="p-1">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 flex items-center justify-between">
                      {(quantities[product.id] || 0) * product.price}
                      <button onClick={() => removeItem(product.id)} className="ml-4 p-1 rounded">
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}

                {cartItems.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      Your cart is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/shop')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md mb-4">
          Return To Shop
        </button>
      </div>

      {/* Coupon and Cart Total */}
      <div className="flex flex-col lg:flex-row gap-8 justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Coupon Section */}
        <div className="flex-1">
          {/* Coupon input section is commented out */}
        </div>

        {/* Cart Total */}
        <div className="w-full lg:w-1/3 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart Total</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm font-medium text-gray-900">{subtotal}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Shipping:</span>
              <span className="text-sm font-medium text-green-600">Free</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-semibold text-gray-900">Total:</span>
              <span className="text-sm font-semibold text-gray-900">{subtotal}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="w-full mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
            Proceed to checkout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
