'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
        // define association here
        this.belongsTo(models.User, {
          foreignKey: 'userId',
          as: 'user'
        });
  
        this.belongsTo(models.Event, {
          foreignKey: 'eventId',
          as: 'event'
        });
      }
  }
  Bookmark.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Bookmark',
  });
  return Bookmark;
};
