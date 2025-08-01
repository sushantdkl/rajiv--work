import { User } from './src/models/index.js';
import { sequelize } from './src/database/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection established.');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: 'rajiv@gmail.com' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
    } else {
      // Create admin user
      const adminUser = await User.create({
        name: 'Rajiv Admin',
        email: 'rajiv@gmail.com',
        password: 'admin123', // In a production environment, use a hashed password
        role: 'admin'
      });
      
      console.log('Admin user created successfully:', adminUser.email);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();