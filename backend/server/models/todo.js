module.exports = (sequelize, DataTypes) => {
  // const Todo = sequelize.define('Todo', {
  const Todo = sequelize.define("Todo", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
      tableName: 'Todos',
      underscored: false,
      timestamps: false
    }

  );
  /*
  Todo.associate = (models) => {
    Todo.hasMany(models.TodoItem, {
      foreignKey: 'todoId',
      as: 'todoItems',
    });
  };
  */
  return Todo;
};
