'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_faqs extends Model {
    static associate(models) { }

  }
  tbl_faqs.init({
    faq_id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    faq_question: DataTypes.STRING(200),
    faq_ans: DataTypes.STRING(200),
    faq_is_active: DataTypes.TINYINT(1),
    faq_is_delete: DataTypes.TINYINT(1),
  }, {
    sequelize,
    modelName: 'tbl_faqs',
    timestamps: true,
    createdAt: "faq_created_at",
    updatedAt: "faq_updated_at"
  });
  return tbl_faqs;
};