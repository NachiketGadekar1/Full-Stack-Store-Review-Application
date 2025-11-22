const { User, Store, Rating } = require('../models');
const bcrypt = require('bcryptjs');
const { Sequelize, Op } = require('sequelize');

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

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

const getStores = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user.id;

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    const stores = await Store.findAll({
      where: whereClause,
      attributes: [
        'id',
        'name',
        'address',
        [Sequelize.fn('AVG', Sequelize.col('Ratings.rating')), 'overallRating'],
      ],
      include: [
        {
          model: Rating,
          attributes: [],
        },
      ],
      group: ['Store.id'],
      order: [['name', 'ASC']],
    });

    // For each store, find the user's specific rating
    const storesWithUserRating = await Promise.all(
      stores.map(async (store) => {
        const userRating = await Rating.findOne({
          where: {
            store_id: store.id,
            user_id: userId,
          },
        });
        return {
          ...store.get({ plain: true }),
          userSubmittedRating: userRating ? userRating.rating : null,
        };
      })
    );

    res.json(storesWithUserRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitOrUpdateRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    // Validate input
    if (!store_id || rating === undefined) {
      return res.status(400).json({ message: 'Please provide store_id and rating.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Upsert the rating
    await Rating.upsert({
      user_id,
      store_id,
      rating,
    });

    res.json({ message: 'Rating submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updatePassword,
  getStores,
  submitOrUpdateRating,
};
