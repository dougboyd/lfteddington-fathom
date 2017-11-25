module.exports = (sequelize, DataTypes) => {
  const AccountDetail = sequelize.define(
    "AccountDetail",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      account_id: DataTypes.INTEGER,
      account_number: DataTypes.STRING,
      description: DataTypes.STRING,
    }, {
      tableName: "account_details",
      timestamps: false,
      underscored: true
    }, {
      classMethods: {
        associate: function(models) {
          AccountDetail.hasMany(models.JournalLineItem, { foreignKey: 'account_id', targetKey: 'account_id'});
        },
      }
    }
  );

  return AccountDetail;
};
