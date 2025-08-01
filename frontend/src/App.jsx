import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./Public/Login";
import Register from "./Public/Register";
import Contact from "./Public/Contact";
import About from "./Public/About";
import Cart from "./Public/Cart";
import Shop from "./Public/Shop";
import Productdetails from "./Public/Productdetails";
import AdminDashboard from "./Private/AdminDashboard";
import Order from "./Private/Order";
import User from "./Private/User";
import Product from "./Private/Product";
import AddProduct from "./Private/AddProduct";
import EditProduct from "./Private/EditProduct";

import Landing from "./Public/Landing";
import Profile from "./Public/Profile";
import OrderHistory from "./Public/OrderHistory";
import Manageaccount from "./Private/Manageaccount";
import ManageAddress from "./Private/ManageAddress";
import OrderHistoryPage from "./Private/OrderHistoryPage";
import Navbar from "./component/Navbar";
import Checkout from "./Public/Checkout";

import { useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function RequireAdmin({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Check if user is logged in and has admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  if (!user) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Optionally, clear admin token if not on admin route
    // if (!isAdminRoute) localStorage.removeItem('adminToken');
  }, [isAdminRoute]);

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route
          path="/admin/*"
          element={
            <RequireAdmin>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="orders" element={<Order />} />
                <Route path="users" element={<User />} />
                <Route path="products" element={<Product />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:productId" element={<EditProduct />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" />} />
              </Routes>
            </RequireAdmin>
          }
        />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/productdetails" element={<Productdetails />} />
        <Route path="/productdetails/:id" element={<Productdetails />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/order-history" element={<RequireAuth><OrderHistory /></RequireAuth>} />
        <Route path="/manageaccount" element={<RequireAuth><Manageaccount /></RequireAuth>} />
        <Route path="/manage-address" element={<RequireAuth><ManageAddress /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
