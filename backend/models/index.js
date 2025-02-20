const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Asset = require('./asset.model.js')(sequelize, Sequelize);
db.AssetHistory = require('./assetHistory.model.js')(sequelize, Sequelize);
db.Category = require('./category.model.js')(sequelize, Sequelize);
db.Employee = require('./employee.model.js')(sequelize, Sequelize);
db.Attachment = require('./attachment.model.js')(sequelize, Sequelize);
db.User = require('./user.model.js')(sequelize, Sequelize);

db.Asset.belongsTo(db.Category);
db.Category.hasMany(db.Asset);

db.Asset.belongsTo(db.Employee);
db.Employee.hasMany(db.Asset);

db.Asset.hasMany(db.AssetHistory);
db.AssetHistory.belongsTo(db.Asset);

db.Asset.hasMany(db.Attachment);
db.Attachment.belongsTo(db.Asset);

module.exports = db;