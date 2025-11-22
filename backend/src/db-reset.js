const sequelize = require('./config/database');
require('./models'); 

const resetDatabase = async () => {
  console.log('This script will drop all tables and recreate them.');
  console.log('Starting database reset...');

  try {
    await sequelize.sync({ force: true });
    console.log('✅ All tables were successfully dropped and recreated.');
  } catch (error) {
    console.error('❌ Error resetting the database:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

resetDatabase();
