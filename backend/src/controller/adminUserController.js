import { User } from "../models/index.js";

/**
 * Get all users for admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    console.error("Failed to fetch users", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * Delete user by ID for admin
 */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deletion of admin users
    if (user.role === 'admin' || user.isAdmin) {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};