const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Rating extends Model {}

Rating.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
}, {
  sequelize,
  tableName: 'ratings',
});

module.exports = Rating;
