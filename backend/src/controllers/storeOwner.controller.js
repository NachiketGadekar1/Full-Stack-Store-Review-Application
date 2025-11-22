const { User, Store, Rating } = require('../models');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Assuming req.user is populated by auth middleware

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide old and new passwords.' });
    }

    // Get user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password.' });
    }

    // Hash and update new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStoreDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find the store owned by this user
    const store = await Store.findOne({ where: { owner_id: ownerId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found for this owner.' });
    }

    // Get average rating using Sequelize aggregation
    const avgRatingResult = await Rating.findOne({
      where: { store_id: store.id },
      attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating']],
      raw: true,
    });
    const averageRating = avgRatingResult ? parseFloat(avgRatingResult.averageRating) : 0;

    // Get all ratings with user info for that store
    const ratingsWithUsers = await Rating.findAll({
      where: { store_id: store.id },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email'],
      }],
      attributes: ['rating'],
    });

    // Format the list of users who rated
    const usersWhoRated = ratingsWithUsers.map(r => ({
      id: r.User.id,
      name: r.User.name,
      email: r.User.email,
      rating: r.rating,
    }));

    res.json({
      storeName: store.name,
      averageRating: parseFloat(averageRating.toFixed(2)),
      usersWhoRated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updatePassword,
  getStoreDashboard,
};
