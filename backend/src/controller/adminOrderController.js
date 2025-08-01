import { Order } from "../models/order.js";
import { User } from "../models/user/User.js";

/**
 * Get all orders with user info for admin
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'User',
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("Failed to fetch orders", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/**
 * Update order status by orderId for admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Missing status in request body" });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Failed to update order status", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
