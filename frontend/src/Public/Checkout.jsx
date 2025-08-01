import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUser, FaMoneyBillWave, FaTruck, FaShieldAlt, FaUndo, FaCheck } from "react-icons/fa";
import { createOrder } from "../service/orderApi.js";
import { getProductById } from "../service/productApi.js";
import { AuthContext } from "../context/AuthContext";

function formatPrice(amount) {
  return "Rs. " + amount.toFixed(2);
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Redirect to login if user is not authenticated
  React.useEffect(() => {
    if (!user) {
      alert("Please login to proceed with checkout");
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const [dummyCart, setDummyCart] = useState(() => {
    try {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [saveShippingInfo, setSaveShippingInfo] = useState(false);

  // Form states
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Nepal",
  });

  const [cartProducts, setCartProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const shipping = 0;
  const discount = isCouponApplied ? subtotal * 0.1 : 0; // 10% discount
  const total = subtotal + shipping - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    async function fetchCartProducts() {
      console.log("dummyCart in Checkout:", dummyCart);
      const products = [];
      let total = 0;
      for (const item of dummyCart) {
        try {
          const product = await getProductById(item.productId);
          console.log("Fetched product:", product);
          products.push({ ...product, quantity: item.quantity });
          total += product.price * item.quantity;
        } catch (error) {
          console.error("Failed to fetch product", error);
        }
      }
      setCartProducts(products);
      setSubtotal(total);
    }
    fetchCartProducts();
  }, [dummyCart]);

  const handleApplyCoupon = () => {
    if (coupon.toLowerCase() === "welcome10") {
      setIsCouponApplied(true);
      alert("10% discount applied successfully!");
    } else {
      alert("Please enter a valid coupon code.");
    }
  };

  const handleRemoveCoupon = () => {
    setIsCouponApplied(false);
    setCoupon("");
    alert("Discount has been removed.");
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];

    for (const field of requiredFields) {
      if (!form[field].trim()) {
        alert(`Please fill in your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Phone validation (at least 10 digits)
    if (form.phone.replace(/\D/g, "").length < 10) {
      alert("Please enter a valid phone number (at least 10 digits).");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const addressString = `${form.address}, ${form.city}, ${form.state}, ${form.zipCode}, ${form.country}`;

    try {
      for (const item of cartProducts) {
        const itemSubTotal = item.price && item.quantity ? item.price * item.quantity : 0;
        const orderData = {
          userId: user?.id || 1, // Use a default user ID (1) instead of "guest" string
          productId: item.id,
          quantity: item.quantity,
          address: addressString,
          subTotal: itemSubTotal,
          orderNumber: `ORD-${Date.now()}`,
          totalAmount: total, // Use the calculated total instead of subtotal
          paymentMethod: paymentMethod,
          paymentStatus: "Pending",
          trackingNumber: null,
          shippingAddress: {
            street: form.address,
            city: form.city,
            state: form.state,
            zipCode: form.zipCode,
            country: form.country,
          },
          items: cartProducts.map((prod) => ({
            productId: prod.id,
            quantity: prod.quantity,
            price: prod.price,
          })),
        };

        console.log("Sending orderData:", orderData);

        const response = await createOrder(orderData);

        if (!response || response.message !== "Order created successfully") {
          alert("Failed to place order. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      setShowSuccess(true);
      localStorage.removeItem("cart");
      alert("Order placed successfully!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      alert("Unable to place order. Please check your connection and try again.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Your cart is empty. Please add products before checkout.</p>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order placed successfully! Redirecting to homepage...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
      <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">State</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">ZIP Code</label>
          <input
            type="text"
            name="zipCode"
            value={form.zipCode}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Country</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Payment Method</label>
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="cod">Cash on Delivery</label>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition"
        >
          {isLoading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}