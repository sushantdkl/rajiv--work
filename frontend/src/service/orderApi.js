import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = localStorage.getItem('user');
  if (!user) return {};
  
  try {
    const userData = JSON.parse(user);
    if (userData.token) {
      return {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json'
      };
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  
  return { 'Content-Type': 'application/json' };
};

// Helper function to get user data from localStorage
const getUserData = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export async function createOrder(orderData) {
  const response = await axios.post(API_URL, orderData, {
    headers: getAuthHeaders()
  });
  return response.data;
}

export async function getUserOrders() {
  const userData = getUserData();
  
  if (!userData || !userData.id) {
    throw new Error('User not authenticated or missing ID');
  }
  
  try {
    const response = await axios.get(`${API_URL}/user/${userData.id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}
