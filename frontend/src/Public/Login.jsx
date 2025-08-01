import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.data.access_token;
        const role = response.data.data.role;
        
        // Decode the JWT token to get user information
        const decodedToken = jwtDecode(token);
        const user = decodedToken.user;
        
        // Store user data including ID, name, email and role
        const userData = { 
          id: user.id,
          name: user.name,
          email: user.email, 
          token,
          role: role
        };
        
        login(userData);
        
        // Navigate based on role
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          // Always navigate to landing page for regular users
          navigate('/');
        }
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Helmets & Gears
        </h2>
        <p className="text-center text-gray-600 mb-8">Log in to your account</p>

        {error && (
          <div className="mb-4 text-red-600 font-medium text-center">{error}</div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                Forgot password?
              </a>
            </div>
            <div className="text-sm">
              <a href="/register" className="font-medium text-orange-600 hover:text-orange-500">
                Create a new account
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
                loading ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
