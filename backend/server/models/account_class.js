module.exports = (sequelize, DataTypes) => {
  const AccountClass = sequelize.define(
    "AccountClass",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: DataTypes.STRING,
      credit_increases_yn: DataTypes.STRING,
    }, {
      tableName: "account_classes",
      timestamps: false,
      underscored: true
    }
  );

  return AccountClass;
}
