import { sequelize } from './src/database/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection established.');
    
    // Get all tables
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('Tables:', tables);
    
    // Get Orders table structure
    const orderTableInfo = await sequelize.getQueryInterface().describeTable('Orders');
    console.log('Orders table structure:', JSON.stringify(orderTableInfo, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();