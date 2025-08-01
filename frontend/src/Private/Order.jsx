import React, { useState, useEffect } from "react";
import { motion,} from "framer-motion";
import {
  FaShoppingCart,
  FaEye,
  FaEdit,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSearch,
  FaDownload,
  FaPrint,
} from "react-icons/fa";
import AdminNavbar from "../component/AdminNavbar";
import { isAdminTokenValid, getAuthHeaders, handleAuthError } from "../utils/auth.js";
import { useNavigate } from "react-router-dom";


const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin token is valid when component mounts
    if (!isAdminTokenValid()) {
      console.error("No valid admin credentials found");
      // Redirect to login page
      navigate("/admin/login");
      return;
    }
    
    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      // Check if token is valid
      if (!isAdminTokenValid()) {
        console.error("No valid admin credentials found");
        navigate("/admin/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/admin/orders", {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } else if (response.status === 401 || response.status === 403) {
        // Handle authentication errors
        localStorage.removeItem("adminToken");
        localStorage.removeItem("role");
        navigate("/admin/login");
      } else {
        console.error("Failed to fetch orders: Please try again later.");
      }
    } catch (error) {
      console.error("Orders fetch error:", error);
      // Create an error object with response property to match handleAuthError expectations
      if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
        handleAuthError({ response: { status: 401 } }, navigate);
      } else {
        console.error("Unable to load orders.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.User?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.User?.lastName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.User?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Check if token is valid
      if (!isAdminTokenValid()) {
        console.error("No valid admin credentials found");
        navigate("/admin/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        console.log(`Order status updated to ${newStatus}`);
        fetchOrders(); // Refresh orders
      } else if (response.status === 401 || response.status === 403) {
        // Handle authentication errors
        localStorage.removeItem("adminToken");
        localStorage.removeItem("role");
        navigate("/admin/login");
      } else {
        console.error("Failed to update order status.");
      }
    } catch (error) {
      console.error("Update order error:", error);
      // Create an error object with response property to match handleAuthError expectations
      if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
        handleAuthError({ response: { status: 401 } }, navigate);
      } else {
        console.error("Unable to update order.");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="text-yellow-500" />,
      processing: <FaEdit className="text-blue-500" />,
      shipped: <FaTruck className="text-purple-500" />,
      delivered: <FaCheckCircle className="text-green-500" />,
      cancelled: <FaExclamationTriangle className="text-red-500" />,
    };
    return icons[status] || <FaClock className="text-gray-500" />;
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      {/* Header */}
      <div
        className="bg-white shadow-sm border-b"
        style={{ marginTop: "80px" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Management
              </h1>
              <p className="text-gray-600">
                Manage and track all customer orders
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Export and Print buttons removed as requested */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
              >
                <option value="all" className="text-black">
                  All Orders
                </option>
                <option value="pending" className="text-black">
                  Pending
                </option>
                <option value="processing" className="text-black">
                  Processing
                </option>
                <option value="shipped" className="text-black">
                  Shipped
                </option>
                <option value="delivered" className="text-black">
                  Delivered
                </option>
                <option value="cancelled" className="text-black">
                  Cancelled
                </option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Orders ({filteredOrders.length})
            </h2>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            #{order.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.User?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.User?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">
                              {order.status}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openOrderModal(order)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEye />
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                            className="text-sm border border-gray-300 rounded px-2 py-1 text-black bg-white"
                          >
                            <option value="pending" className="text-black">
                              Pending
                            </option>
                            <option value="processing" className="text-black">
                              Processing
                            </option>
                            <option value="shipped" className="text-black">
                              Shipped
                            </option>
                            <option value="delivered" className="text-black">
                              Delivered
                            </option>
                            <option value="cancelled" className="text-black">
                              Cancelled
                            </option>
                          </select>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaShoppingCart className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Details - {selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedOrder.User?.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedOrder.User?.email}
                    </p>
                    <p>
                      <span className="font-medium">Order Date:</span>{" "}
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1 capitalize">
                          {selectedOrder.status}
                        </span>
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Order Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Total Amount:</span>{" "}
                      {formatCurrency(selectedOrder.totalAmount)}
                    </p>
                    <p>
                      <span className="font-medium">Payment Method:</span>{" "}
                      {selectedOrder.paymentMethod}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>{" "}
                      {selectedOrder.paymentStatus}
                    </p>
                    {selectedOrder.trackingNumber && (
                      <p>
                        <span className="font-medium">Tracking:</span>{" "}
                        {selectedOrder.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">
                  Shipping Address
                </h4>
                <div className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress?.street}
                  <br />
                  {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.state}{" "}
                  {selectedOrder.shippingAddress?.zipCode}
                  <br />
                  {selectedOrder.shippingAddress?.country}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>Item {index + 1}</span>
                      <span>
                        {formatCurrency(item.price)} x {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
