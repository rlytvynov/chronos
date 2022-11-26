module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users_calendars', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    calendarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'calendars',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('user','moder','master'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'users_calendars',
    timestamps: false,
    indexes: [
      {
        name: "userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "calendarId",
        using: "BTREE",
        fields: [
          { name: "calendarId" },
        ]
      },
    ]
  });
};
