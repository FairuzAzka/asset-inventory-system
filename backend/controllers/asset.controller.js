// controllers/asset.controller.js
const db = require('../models');
const Asset = db.Asset;
const Category = db.Category;
const Employee = db.Employee;
const AssetHistory = db.AssetHistory;
const Attachment = db.Attachment;
const { Op } = require('sequelize');

// Get all assets with pagination and sorting
exports.findAll = async (req, res) => {
  try {
    const { page = 1, size = 10, sortBy = 'asset_name', sortOrder = 'ASC', search = '' } = req.query;
    const offset = (page - 1) * size;
    
    // Handle search and sorting
    const condition = search ? {
      [Op.or]: [
        { asset_name: { [Op.like]: `%${search}%` } },
        { asset_number: { [Op.like]: `%${search}%` } }
      ]
    } : null;
    
    const { count, rows } = await Asset.findAndCountAll({
      where: condition,
      order: [[sortBy, sortOrder]],
      limit: parseInt(size),
      offset: offset,
      include: [
        { model: Category, attributes: ['name'] },
        { model: Employee, attributes: ['name'] }
      ]
    });
    
    res.send({
      totalItems: count,
      assets: rows,
      currentPage: page,
      totalPages: Math.ceil(count / size)
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while retrieving assets."
    });
  }
};

// Create new asset
exports.create = async (req, res) => {
  try {
    // Create asset
    const asset = await Asset.create(req.body);
    
    // Create initial history entry
    await AssetHistory.create({
      asset_id: asset.id,
      action: 'created',
      description: 'Asset was created',
      date: new Date(),
      performed_by: req.userId
    });
    
    res.status(201).send(asset);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error occurred while creating asset."
    });
  }
};

// Implementasi metode lainnya: findOne, update, delete, dll.