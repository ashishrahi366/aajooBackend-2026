'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_faqs', {
      faq_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      faq_question: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      faq_ans: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      faq_is_active: {
        type: Sequelize.TINYINT(1),
        allowNull: false
      },
      faq_is_delete: {
        type: Sequelize.TINYINT(1),
        allowNull: false
      },
      faq_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      faq_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_faqs');
  }
};