const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Store, Rating } = require('./models'); 
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');
const storeOwnerRoutes = require('./routes/storeOwner.routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/owner', storeOwnerRoutes);

app.get('/', (req, res) => {
  res.send('Express Server');
});

sequelize.sync() 
  .then(() => {
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
