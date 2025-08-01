import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware to verify admin role
export function verifyAdminRole(req, res, next) {
  // Get token from Authorization header
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.secretkey);
    
    // Check if user has admin role
    if (!decoded.user || decoded.user.role !== 'admin') {
      return res.status(403).send({ message: "Access denied. Admin privileges required." });
    }
    
    req.user = decoded; // Attach decoded payload to request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).send({ message: "Invalid or expired token." });
  }
}