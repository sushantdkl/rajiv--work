import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaUserCog,
  FaSearch,
  FaRegEye,
  FaToggleOn,
  FaToggleOff,
  FaFileExport,
  FaPrint,
  FaTrash,
} from "react-icons/fa";
import AdminNavbar from "../component/AdminNavbar";
import { isAdminTokenValid, getAuthHeaders } from "../utils/auth.js";

const User = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalUser, setModalUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, search, filterStatus]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      if (!isAdminTokenValid()) {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
        return;
      }

      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      } else {
        console.error("Failed to load users.");
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
      }
    } catch (err) {
      console.error("Error loading users:", err);
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];
    if (filterStatus !== "all") {
      filtered = filtered.filter((u) => {
        if (filterStatus === "active") return u.isActive;
        if (filterStatus === "inactive") return !u.isActive;
        if (filterStatus === "admin") return u.isAdmin;
        return true;
      });
    }
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(lowerSearch) ||
          u.lastName?.toLowerCase().includes(lowerSearch) ||
          u.email?.toLowerCase().includes(lowerSearch) ||
          u.phone?.toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      if (!isAdminTokenValid()) {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/status`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );
      if (res.ok) {
        loadUsers();
      } else {
        console.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const deleteUser = (userId, userName) => {
    setDeleteConfirm({ id: userId, name: userName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      if (!isAdminTokenValid()) {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${deleteConfirm.id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        loadUsers();
        alert("User deleted successfully!");
      } else {
        console.error("Delete user failed:", response.status);
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("Delete user error:", error);
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    } finally {
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const openModal = (user) => {
    setModalUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">
              User Administration
            </h1>
            <p className="text-gray-600">Manage and monitor user accounts</p>
          </div>
          <div className="flex space-x-3">
            {/* Export and Print buttons removed as requested */}
          </div>
        </header>

        <motion.div
          className="bg-white rounded-xl shadow-lg border border-red-100 p-6 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch("");
                  setFilterStatus("all");
                }}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg border border-red-100 overflow-x-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-black to-red-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wide">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wide">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wide">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                      <div className="text-red-600 text-2xl">
                        {user.isAdmin ? <FaUserCog /> : <FaUserCircle />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.isAdmin ? "Administrator" : "Customer"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div>{user.email}</div>
                      <div className="text-xs text-gray-500">
                        {user.phone || "No phone"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isAdmin
                            ? "bg-black text-white"
                            : user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isAdmin
                          ? "Admin"
                          : user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => openModal(user)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        title="View Details"
                      >
                        <FaRegEye />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`text-sm px-3 py-1 rounded-lg font-medium transition-all duration-200 ${
                          user.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                        title={user.isActive ? "Deactivate User" : "Activate User"}
                      >
                        {user.isActive ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      {!user.isAdmin && user.role !== 'admin' && (
                        <button
                          onClick={() => deleteUser(user.id, user.name)}
                          className="text-red-600 hover:text-red-800 ml-2 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>

      {modalOpen && modalUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg shadow-lg max-w-xl w-full mx-4 max-h-[85vh] overflow-y-auto p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                User Details - {modalUser.firstName} {modalUser.lastName}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {modalUser.firstName} {modalUser.lastName}
              </p>
              <p>
                <strong>Email:</strong> {modalUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {modalUser.phone || "Not provided"}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                {modalUser.isAdmin ? "Administrator" : "Customer"}
              </p>
              <p>
                <strong>Member Since:</strong> {formatDate(modalUser.createdAt)}
              </p>
              <p>
                <strong>Last Login:</strong>{" "}
                {modalUser.lastLoginAt
                  ? formatDate(modalUser.lastLoginAt)
                  : "Never"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {modalUser.isActive ? "Active" : "Inactive"}
              </p>
              <p>
                <strong>Email Verified:</strong>{" "}
                {modalUser.emailVerified ? "Yes" : "No"}
              </p>
              {modalUser.address && (
                <>
                  <p>
                    <strong>Address:</strong>
                  </p>
                  <p className="ml-4">
                    {modalUser.address.street}
                    <br />
                    {modalUser.address.city}, {modalUser.address.state}{" "}
                    {modalUser.address.zipCode}
                    <br />
                    {modalUser.address.country}
                  </p>
                </>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete user "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
