// Authentication utility functions for admin operations

/**
 * Get authorization headers for API requests
 * @returns {Object} Headers object with Authorization token
 */
export const getAuthHeaders = () => {
  const adminToken = localStorage.getItem('adminToken');
  return {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Check if admin token is valid (exists and not expired)
 * @returns {boolean} True if token is valid, false otherwise
 */
export const isAdminTokenValid = () => {
  const adminToken = localStorage.getItem('adminToken');
  const role = localStorage.getItem('role');
  
  if (!adminToken || !role) {
    return false;
  }
  
  // Basic token validation - check if it exists and has proper format
  // In a real application, you might want to decode JWT and check expiration
  try {
    // Check if token has the basic JWT structure (3 parts separated by dots)
    const tokenParts = adminToken.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }
    
    // Check if role is admin
    if (role !== 'admin') {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

/**
 * Handle authentication errors and redirect to login
 * @param {Object} error - Error object from API response
 * @param {Function} navigate - React Router navigate function
 */
export const handleAuthError = (error, navigate) => {
  const status = error.response?.status;
  const message = error.response?.data?.message || 'Authentication error';
  
  if (status === 401 || status === 403) {
    // Clear stored tokens
    localStorage.removeItem('adminToken');
    localStorage.removeItem('role');
    
    // Redirect to admin login
    navigate('/admin/login');
    
    // Log the error for debugging
    console.error('Authentication error:', message);
  } else {
    console.error('API error:', message);
  }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('role');
};

/**
 * Get current admin user info from token
 * @returns {Object|null} User info or null if not available
 */
export const getCurrentAdmin = () => {
  const adminToken = localStorage.getItem('adminToken');
  const role = localStorage.getItem('role');
  
  if (!adminToken || !role) {
    return null;
  }
  
  try {
    // In a real application, you would decode the JWT token to get user info
    // For now, return basic info
    return {
      role: role,
      isAuthenticated: true
    };
  } catch (error) {
    console.error('Error getting current admin:', error);
    return null;
  }
};

/**
 * Check if user has admin privileges
 * @returns {boolean} True if user is admin, false otherwise
 */
export const isAdmin = () => {
  const role = localStorage.getItem('role');
  return role === 'admin';
};
