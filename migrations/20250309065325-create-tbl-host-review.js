'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_host_reviews', {
      hr_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      hr_book_id: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      hr_user_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      hr_host_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      hr_rating: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      hr_title: {
        type: Sequelize.STRING(100),
        // allowNull: false
      },
      hr_description: {
        type: Sequelize.TEXT(),
        // allowNull: false
      },
      hr_isActive: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '1'
      },
      hr_isDelete: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '0'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_host_reviews');
  }
};