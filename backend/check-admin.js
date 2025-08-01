import { User } from './src/models/index.js';
import { sequelize } from './src/database/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Check for admin users
    const adminUsers = await User.findAll({ where: { role: 'admin' } });
    
    if (adminUsers.length > 0) {
      console.log('Found admin users:');
      adminUsers.forEach(admin => {
        console.log(`- Name: ${admin.name}, Email: ${admin.email}, Role: ${admin.role}`);
      });
    } else {
      console.log('No admin users found.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
