import { sequelize } from './src/database/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection established.');
    
    // Add missing columns to Orders table
    const queryInterface = sequelize.getQueryInterface();
    
    // Add orderNumber column
    await queryInterface.addColumn('Orders', 'orderNumber', {
      type: sequelize.Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    console.log('Added orderNumber column');
    
    // Add totalAmount column
    await queryInterface.addColumn('Orders', 'totalAmount', {
      type: sequelize.Sequelize.FLOAT,
      allowNull: true
    });
    console.log('Added totalAmount column');
    
    // Add paymentMethod column
    await queryInterface.addColumn('Orders', 'paymentMethod', {
      type: sequelize.Sequelize.STRING,
      allowNull: true
    });
    console.log('Added paymentMethod column');
    
    // Add paymentStatus column
    await queryInterface.addColumn('Orders', 'paymentStatus', {
      type: sequelize.Sequelize.STRING,
      allowNull: true
    });
    console.log('Added paymentStatus column');
    
    // Add trackingNumber column
    await queryInterface.addColumn('Orders', 'trackingNumber', {
      type: sequelize.Sequelize.STRING,
      allowNull: true
    });
    console.log('Added trackingNumber column');
    
    // Add shippingAddress column
    await queryInterface.addColumn('Orders', 'shippingAddress', {
      type: sequelize.Sequelize.JSON,
      allowNull: true
    });
    console.log('Added shippingAddress column');
    
    // Add items column
    await queryInterface.addColumn('Orders', 'items', {
      type: sequelize.Sequelize.JSON,
      allowNull: true
    });
    console.log('Added items column');
    
    console.log('Database schema updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();