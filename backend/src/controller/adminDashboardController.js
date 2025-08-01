import { User } from "../models/user/User.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product/Product.js";
import { Op } from "sequelize";

/**
 * Get dashboard data for admin
 * Includes stats, recent orders, recent users, top products, and order status counts
 */
export const getDashboardData = async (req, res) => {
  try {
    const { timeframe } = req.query;
    
    // Calculate date range based on timeframe
    const currentDate = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case 'week':
        startDate.setDate(currentDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(currentDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(currentDate.getDate() - 7); // Default to week
    }
    
    // Get total counts
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    
    // Get orders within the timeframe
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, currentDate]
        }
      },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    
    // Calculate total orders and revenue
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Get recent orders (last 5)
    const recentOrders = orders.slice(0, 5);
    
    // Get recent users (last 5)
    const recentUsers = await User.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "name", "email", "createdAt"],
    });
    
    // Count orders by status
    const orderStatus = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    
    orders.forEach(order => {
      const status = order.status.toLowerCase();
      if (orderStatus.hasOwnProperty(status)) {
        orderStatus[status]++;
      }
    });
    
    // Get top products (placeholder - would need to calculate based on order items)
    // In a real implementation, you would join with order items and group by product
    const topProducts = await Product.findAll({
      limit: 5,
      order: [["stock", "DESC"]], // Using stock as a placeholder for popularity
    });
    
    // Prepare response data
    const dashboardData = {
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
      },
      recentOrders,
      recentUsers,
      topProducts,
      orderStatus,
    };
    
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};