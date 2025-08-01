import { Order } from "../models/order.js";

/**
 * Create a new order
 */
export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      productId,
      quantity,
      address,
      subTotal,
      orderNumber,
      totalAmount,
      paymentMethod,
      paymentStatus,
      trackingNumber,
      shippingAddress,
      items,
    } = req.body;

    if (!userId || !quantity || !totalAmount || !paymentMethod || !paymentStatus) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Ensure userId is a number
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const order = await Order.create({
      userId: userIdNum,
      productId,
      quantity,
      address,
      subTotal,
      orderNumber,
      totalAmount,
      paymentMethod,
      paymentStatus,
      trackingNumber,
      shippingAddress,
      items,
      status: "Pending",
    });
    res.status(201).json({ message: "Order created successfully", data: order });
  } catch (error) {
    console.error("Failed to create order", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

/**
 * Get orders by userId
 */
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }
    const orders = await Order.findAll({ where: { userId } });
    res.status(200).json({ message: "Orders fetched successfully", data: orders });
  } catch (error) {
    console.error("Failed to fetch orders", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
