module.exports = (sequelize, DataTypes) => {
    const Asset = sequelize.define('Asset', {
      asset_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      asset_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT
      },
      purchase_date: {
        type: DataTypes.DATE
      },
      purchase_cost: {
        type: DataTypes.DECIMAL(10, 2)
      },
      status: {
        type: DataTypes.ENUM('available', 'assigned', 'maintenance', 'retired'),
        defaultValue: 'available'
      },
      location: {
        type: DataTypes.STRING
      }
    });
    
    return Asset;
  };