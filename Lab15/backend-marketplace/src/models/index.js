const sequelize = require('../config/database');
const Product = require('./Product');
const Category = require('./Category');
const User = require('./User');
const Role = require('./Role');

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

module.exports = { sequelize, Product, Category, User, Role };
