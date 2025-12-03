"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("presensis", "latitude", {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true
    });

    await queryInterface.changeColumn("presensis", "longitude", {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("presensis", "latitude", {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: false
    });

    await queryInterface.changeColumn("presensis", "longitude", {
      type: Sequelize.DECIMAL(10, 7),
      allowNull: false
    });
  }
};