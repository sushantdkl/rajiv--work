import { User } from "../../models/index.js";
import { generateToken } from "../../security/jwt-util.js";

// Admin login
const adminLogin = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!req.body.password) {
      return res.status(400).send({ message: "Password is required" });
    }
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    if (user.password !== req.body.password) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    if (user.role !== 'admin') {
      return res.status(403).send({ message: "Not an admin account" });
    }
    const token = generateToken({ user: { ...user.toJSON(), role: user.role } });
    return res.status(200).send({
      data: { access_token: token, role: user.role },
      message: "successfully logged in as admin",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to login as admin" });
  }
};

// User login (unchanged)
const login = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!req.body.password) {
      return res.status(400).send({ message: "Password is required" });
    }
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    if (user.password !== req.body.password) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    const token = generateToken({ user: { ...user.toJSON(), role: user.role } });
    return res.status(200).send({
      data: { access_token: token, role: user.role },
      message: "successfully logged in",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to login" });
  }
};

/**
 *  init
 */

const init = async (req, res) => {
  try {
    const user = req.user.user;
    delete user.password;
    res
      .status(201)
      .send({ data: user, message: "successfully fetched current  user" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const authController = {
  login,
  adminLogin,
  init,
};
