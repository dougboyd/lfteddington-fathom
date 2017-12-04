module.exports = (sequelize, DataTypes) => {
  const AccountDetail = sequelize.define(
    "AccountDetail",
    {
      account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      // account_id: DataTypes.INTEGER,
      parent_account_id: DataTypes.INTEGER,
      account_number: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      active_yn: DataTypes.STRING,
    }, {
      tableName: "account_details",
      timestamps: false,
      underscored: true
    }
  );

  AccountDetail.associate = function (models) {
    AccountDetail.hasMany(models.JournalLineItem,
      {
        foreignKey: 'account_id',
        targetKey: 'account_id',
        as: 'journal_line_items'
      });
    AccountDetail.hasMany(models.AccountDetail,
      {
        foreignKey: 'parent_account_id',
        targetKey: 'account_id',
        as: 'child_accounts',
      });
  }

  /*
  AccountDetail.associate = function (models) {
    AccountDetail.hasMany(models.AccountDetail,
      {
        foreignKey: 'parent_account_id',
        targetKey: 'account_id',
        as: 'child_accounts',
      });
  }
  */

  return AccountDetail;
}
