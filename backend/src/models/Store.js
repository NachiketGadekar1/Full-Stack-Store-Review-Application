const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Store extends Model {}

Store.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    }
  }
}, {
  sequelize,
  tableName: 'stores',
});

module.exports = Store;
