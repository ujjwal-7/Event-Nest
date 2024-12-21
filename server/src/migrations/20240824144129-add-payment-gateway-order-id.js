'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('Orders', 'paymentGatewayOrderId', {
      type: Sequelize.STRING,
      allowNull: true, // Change this based on your requirements
      unique: false // Set to true if you want to enforce uniqueness
    });

    await queryInterface.addConstraint('Orders', {
      fields: ['orderId'],
      type: 'unique',
      name: 'unique_orderId' // Optionally specify a constraint name
    });

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeConstraint('Orders', 'unique_orderId');

    await queryInterface.removeColumn('Orders', 'paymentGatewayOrderId');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
