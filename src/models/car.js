const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Car = sequelize.define('Car', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  make: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  license_plate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  transmission: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fuel_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  seats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  daily_rate: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'cars',
  timestamps: true
});

module.exports = Car;
