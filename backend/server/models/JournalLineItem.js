"use strict";
module.exports = (sequelize, DataTypes) => {
  const JournalLineItem = sequelize.define(
    "JournalLineItem", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      debit: DataTypes.DECIMAL(19, 2),
      credit: DataTypes.DECIMAL(19, 2),
      journal_entry_id: DataTypes.INTEGER,
      account_id: DataTypes.INTEGER,
      action_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
    }, {
      tableName: "journal_line_items",
      timestamps: false,
      underscored: true
    },
  );
  
  JournalLineItem.associate = function (models) {
    JournalLineItem.belongsTo(models.AccountDetail, {
      foreignKey: 'account_id', 
      targetKey: 'account_id'
    });
    JournalLineItem.belongsTo(models.JournalEntry, {
      foreignKey: 'journal_entry_id',
      targetKey: 'id'
    });
  }

  return JournalLineItem;
};