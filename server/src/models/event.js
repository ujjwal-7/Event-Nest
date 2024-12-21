'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'hostId',
        as: 'host'
      });
      this.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
      });
      this.belongsTo(models.Address, {
        foreignKey: 'addressId',
        as: 'address',
      });

      this.hasMany(models.Order, {
        foreignKey: 'eventId'
      })

      this.hasMany(models.Bookmark, {
        foreignKey: 'eventId'
      })
    }
  }
  Event.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    seats: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};

