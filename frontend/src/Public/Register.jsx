import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {createUser } from "../service/userApi.js"; // Adjust the import path as necessary

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [users, setUsers] = useState([]);

  // Fetch all users (optional – useful for admin validation, duplicate check, etc.)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data.data); // Adjust according to your API structure
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

 const onSubmit = async (data) => {
  const { name, email, password, confirmPassword } = data;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await createUser({ name, email, password });
    alert("Registered successfully");
    reset();
    setTimeout(() => navigate("/login"), 1000);
  } catch (error) {
    console.error("Registration error:", error);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Registration failed";

    alert(message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Create a New Account
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Register to start shopping with Helmets & Gears
        </p>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              {...register("name", { required: true })}
              id="name"
              name="name"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Your full name"
            />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              id="email"
              name="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required", minLength: 6 })}
              id="password"
              name="password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword", { required: "Please confirm your password" })}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-orange-600 hover:text-orange-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
