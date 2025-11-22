const sequelize = require('./config/database');
const { User } = require('./models');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
  console.log('Seeding database with initial data...');

  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('AdminPassword1!', salt);

      await User.create({
        name: 'Default Administrator User',
        email: adminEmail,
        password: hashedPassword,
        address: '123 Admin Way, System City',
        role: 'admin',
      });
      console.log('✅ Default admin user created successfully.');
      console.log(`   - Email: ${adminEmail}`);
      console.log(`   - Password: AdminPassword1!`);
    }


  } catch (error) {
    console.error('❌ Error seeding the database:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

seedDatabase();
