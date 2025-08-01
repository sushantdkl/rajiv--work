"use client"
 
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import ProfileLayout from "../component/ProfileLayout"
import { getUserOrders } from "../service/orderApi.js"
import { getProductById } from "../service/productApi.js"
import { AuthContext } from "../context/AuthContext"

 
export default function OrderHistory(){
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [productImages, setProductImages] = useState({})
 
  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      setError("Please log in to view your order history")
      setLoading(false)
      return
    }
    
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await getUserOrders()
        setOrders(response.data)
        
        // Fetch product details for each order item
        const productIds = new Set()
        response.data.forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              if (item.productId) {
                productIds.add(item.productId)
              }
            })
          }
        })
        
        // Fetch product details and store image URLs
        const imageMap = {}
        for (const productId of productIds) {
          try {
            const product = await getProductById(productId)
            if (product && product.imageUrl) {
              imageMap[productId] = `http://localhost:5000${product.imageUrl}`
            }
          } catch (err) {
            console.error(`Failed to fetch product ${productId}:`, err)
          }
        }
        
        setProductImages(imageMap)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch orders", error)
        setError("Failed to load order history. Please try again later.")
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [user])
 
  const handleReturnRefund = (order) => {
    navigate("/return-refund", { state: { order } })
  }
 
  return (
    <ProfileLayout>
      <div className="p-10 bg-gray-50 min-h-218">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <p>{error}</p>
            {error === "Please log in to view your order history" && (
              <button 
                onClick={() => navigate("/login")} 
                className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
              >
                Go to Login
              </button>
            )}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-gray-600">You don't have any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0 relative">
                  {order.items && order.items[0] && order.items[0].productId && !productImages[order.items[0].productId] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                      </div>
                    </div>
                  )}
                  <img
                    src={order.items && order.items[0] && order.items[0].productId && productImages[order.items[0].productId] ? 
                      productImages[order.items[0].productId] : 
                      "/placeholder.svg"}
                    alt="Product"
                    className="w-32 h-32 object-cover rounded-lg border"
                    onError={(e) => { e.target.src = "/placeholder.svg"; }}
                  />
                </div>
 
                {/* Product Details */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {order.items && order.items.length > 0 ? 
                        `Order #${order.id} - ${order.items.length} item(s)` : 
                        `Order #${order.id}`}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{order.address || order.shippingAddress ? 
                      (typeof order.shippingAddress === 'object' ? 
                        `${order.shippingAddress.street}, ${order.shippingAddress.city}` : 
                        order.address) : 
                      'No address provided'}</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Purchased on: {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>Purchase For: Rs {order.subTotal || order.totalAmount || 0}</span>
                    </div>
                    <p className="text-sm text-green-600 font-medium mt-1">{order.status}</p>
                    {order.items && order.items.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Items: {order.items.map((item, idx) => (
                          <span key={idx} className="inline-block bg-gray-100 rounded px-2 py-1 mr-2 mb-1">
                            {item.quantity}x Product #{item.productId} (Rs {item.price})
                          </span>
                        ))}</p>
                      </div>
                    )}
                  </div>
 
                  {/* Action Button */}
                  {order.status === "Delivered" && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleReturnRefund(order)}
                        className="text-teal-600 hover:text-teal-700 font-medium text-sm underline"
                      >
                        Refund/Return
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  )
}
 
