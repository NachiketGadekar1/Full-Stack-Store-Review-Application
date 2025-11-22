const { Store, User, Rating } = require('../models');
const bcrypt = require('bcryptjs');
const { Sequelize, Op } = require('sequelize');

const addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    // Validate that owner_id is provided
    if (!owner_id) {
      return res.status(400).json({ message: 'Owner ID is required.' });
    }

    // Find the user and validate their role
    const owner = await User.findByPk(owner_id);
    if (!owner) {
      return res.status(404).json({ message: `User with ID ${owner_id} not found.` });
    }
    if (owner.role !== 'owner') {
      return res.status(400).json({ message: `User with ID ${owner_id} is not a store owner and cannot be assigned.` });
    }

    // Check if the owner is already assigned to another store
    const existingAssignment = await Store.findOne({ where: { owner_id: owner_id } });
    if (existingAssignment) {
      return res.status(400).json({ message: `Owner with ID ${owner_id} is already assigned to store '${existingAssignment.name}'.` });
    }

    // Create store
    const newStore = await Store.create({
      name,
      email,
      address,
      owner_id,
    });

    res.status(201).json({ message: 'Store created and assigned successfully', storeId: newStore.id });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'A store with this email already exists.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    res.status(201).json({ message: `User with role '${role}' created successfully`, userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const ratingsCount = await Rating.count({
      col: 'id',
      distinct: false
    });

    res.json({
      totalUsers,
      totalStores,
      totalRatings: ratingsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, sortOrder } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const order = [];
    if (sortBy) {
      order.push([sortBy, sortOrder === 'DESC' ? 'DESC' : 'ASC']);
    } else {
      order.push(['name', 'ASC']);
    }

    const stores = await Store.findAll({
      where,
      attributes: [
        'id',
        'name',
        'email',
        'address',
        [Sequelize.fn('AVG', Sequelize.col('Ratings.rating')), 'averageRating'],
      ],
      include: [{
        model: Rating,
        attributes: [],
        // Required false to make it a LEFT JOIN
        required: false
      }],
      group: ['Store.id'],
      order,
    });
    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const order = [];
    if (sortBy) {
      order.push([sortBy, sortOrder === 'DESC' ? 'DESC' : 'ASC']);
    } else {
      order.push(['name', 'ASC']);
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role'],
      order,
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addStore,
  addUser,
  getDashboardStats,
  getStores,
  getUsers,
};