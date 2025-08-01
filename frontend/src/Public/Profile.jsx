import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import Footer from '../component/Footer';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for user data fetch
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Please login to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Information</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-blue-100">Member since {new Date(user.createdAt || Date.now()).getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium text-gray-900 capitalize">{user.role || 'Customer'}</p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium text-gray-900">#{user.id}</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-green-700 font-medium">Account Active</p>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Your account is in good standing</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => window.location.href = '/order-history'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Order History
                </button>
                <button 
                  onClick={() => window.location.href = '/shop'}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
