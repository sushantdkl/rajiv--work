// Clear Authentication Data Utility
// Run this in browser console to clear all authentication data

function clearAllAuthData() {
  // Clear all authentication-related localStorage items
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("lastLoginTime");
  
  // Clear any other potential auth data
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  
  console.log("All authentication data cleared!");
  console.log("Please refresh the page to see login button.");
  
  // Auto refresh the page
  window.location.reload();
}

// Call the function
clearAllAuthData();
