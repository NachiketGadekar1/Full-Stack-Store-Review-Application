const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// A user can be an owner of a store
User.hasOne(Store, { foreignKey: 'owner_id' });
Store.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });

// A user can have many ratings
User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

// A store can have many ratings
Store.hasMany(Rating, { foreignKey: 'store_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

module.exports = {
  User,
  Store,
  Rating,
};
