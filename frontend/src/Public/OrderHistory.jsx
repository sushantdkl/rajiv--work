import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserOrders } from '../service/orderApi.js';
import { getProductById } from '../service/productApi.js';
import { Package, Calendar, CreditCard, Truck, CheckCircle, Clock } from 'lucide-react';
import Footer from '../component/Footer';

export default function OrderHistory() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        const response = await getUserOrders();
        const ordersData = response.data || [];
        setOrders(ordersData);

        // Fetch product details for each order
        const productMap = {};
        for (const order of ordersData) {
          if (order.productId) {
            try {
              const product = await getProductById(order.productId);
              productMap[order.productId] = product;
            } catch (err) {
              console.error(`Failed to fetch product ${order.productId}:`, err);
            }
          }
        }
        setProductDetails(productMap);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load order history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [user, navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">        
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your order history...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">        
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button 
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const product = productDetails[order.productId];
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">Order Number</p>
                          <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                        </div>
                        <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
                        <div>
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status || 'Pending'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      {/* Product Info */}
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        {product && (
                          <div className="flex-shrink-0">
                            <img
                              src={product.imageUrl ? 
                                (product.imageUrl.startsWith('http') ? 
                                  product.imageUrl : 
                                  `http://localhost:5000${product.imageUrl}`
                                ) : 
                                '/src/assets/icon.png'
                              }
                              alt={product.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium text-gray-900 truncate">
                            {product?.name || 'Product Name'}
                          </p>
                          <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
                          <p className="text-sm text-gray-500">
                            Price: Rs. {product?.price || order.subTotal}
                          </p>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                        <div className="text-center sm:text-right">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-xl font-bold text-gray-900">
                            Rs. {order.totalAmount || order.subTotal}
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CreditCard className="h-4 w-4" />
                            <span className="capitalize">{order.paymentMethod || 'COD'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>{order.paymentStatus || 'Pending'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.address && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">Shipping Address:</p>
                        <p className="text-sm text-gray-700">{order.address}</p>
                      </div>
                    )}

                    {/* Tracking Info */}
                    {order.trackingNumber && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Tracking Number:</span>
                          <span className="text-sm font-medium text-gray-900">{order.trackingNumber}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
