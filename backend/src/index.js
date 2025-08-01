import express from "express";
import cors from "cors";
import { sequelize } from "./database/index.js";
import { userRouter as userRoutes } from "./route/user/userRoute.js";
import { authRouter as authRoutes } from "./route/auth/authRoute.js";
import { productRouter as productRoutes } from "./route/product/productRoute.js";
import uploadRoutes from "./route/uploadRoutes.js";
import orderRoutes from "./route/orderRoute.js";
import adminOrderRoutes from "./route/adminOrderRoute.js";
import adminUserRoutes from "./route/adminUserRoute.js";
import adminDashboardRoutes from "./routes/adminDashboardRoute.js";
import contactRoutes from "./route/contactRoute.js";
import { setupAssociations } from "./models/associations.js";


const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/contacts", contactRoutes);

const PORT = process.env.PORT || 3000;

// Set up model associations
setupAssociations();

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
});
