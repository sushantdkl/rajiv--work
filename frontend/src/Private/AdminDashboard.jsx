// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaEye,
  FaEdit,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
/* Removed useNotification import and related usage due to missing NotificationContext */
import AdminNavbar from "../component/AdminNavbar";


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalRevenue: 0,
    },
    recentOrders: [],
    recentUsers: [],
    topProducts: [],
    orderStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  // Removed showNotification usage due to missing NotificationContext
  // Replaced notification calls with console.error or silent fail

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeframe]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Import auth utilities
      const { getAuthHeaders, isAdminTokenValid, handleAuthError } = await import('../utils/auth.js');
      
      // Check if token is valid
      if (!isAdminTokenValid()) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('role');
        navigate('/admin/login');
        console.error('Your session has expired. Please login again.');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/dashboard?timeframe=${selectedTimeframe}`,
        {
          headers: getAuthHeaders()
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        // Handle auth errors
        if (response.status === 401 || response.status === 403) {
          const errorData = await response.json();
          handleAuthError({ response: { status: response.status, data: errorData } }, navigate);
        } else {
          console.error("Failed to fetch dashboard data: Please try again later.");
        }
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsLoading(false);
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
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      shipped: "bg-purple-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="text-yellow-500" />,
      processing: <FaBox className="text-blue-500" />,
      shipped: <FaTruck className="text-purple-500" />,
      delivered: <FaCheckCircle className="text-green-500" />,
      cancelled: <FaExclamationTriangle className="text-red-500" />,
    };
    return icons[status] || <FaClock className="text-gray-500" />;
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, Administrator</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
              >
                <option value="week" className="text-black">
                  Last 7 days
                </option>
                <option value="month" className="text-black">
                  Last 30 days
                </option>
                <option value="quarter" className="text-black">
                  Last 3 months
                </option>
                <option value="year" className="text-black">
                  Last year
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalUsers}
                </p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaShoppingCart className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalOrders}
                </p>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaBoxOpen className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalProducts}
                </p>
                <p className="text-xs text-green-600">+5% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FaDollarSign className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.stats.totalRevenue)}
                </p>
                <p className="text-xs text-green-600">+15% from last month</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-lg shadow-sm border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
            </div>
            <div className="p-6">
              {dashboardData.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.user?.firstName} {order.user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaShoppingCart className="text-gray-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500">No recent orders</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Users */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Users
              </h2>
            </div>
            <div className="p-6">
              {dashboardData.recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUsers className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <FaEye />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600">
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaUsers className="text-gray-400 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500">No recent users</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Order Status Chart */}
        <motion.div
          className="mt-8 bg-white rounded-lg shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Status Overview
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(dashboardData.orderStatus).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${getStatusColor(
                        status
                      )}`}
                    >
                      {getStatusIcon(status)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600 capitalize">{status}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
