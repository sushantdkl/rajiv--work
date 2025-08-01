import { User } from './user/User.js';
import { Order } from './order.js';

// Define associations between models
export const setupAssociations = () => {
  // User has many Orders
  User.hasMany(Order, {
    foreignKey: 'userId',
    as: 'orders'
  });

  // Order belongs to User
  Order.belongsTo(User, {
    foreignKey: 'userId',
    as: 'User' // This alias must match the include in adminOrderController
  });

  console.log('Model associations have been set up');
};