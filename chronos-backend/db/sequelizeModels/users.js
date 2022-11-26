const config = require('./dbModelsConfig.json');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    login: {
      type: DataTypes.STRING(config.login),
      allowNull: false,
      unique: "login"
    },
    password: {
      type: DataTypes.STRING(config.password),
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING(config.fullName),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(config.email),
      allowNull: false,
      unique: "email"
    },
    profilePic: {
      type: DataTypes.STRING(config.profilePic),
      allowNull: true,
      defaultValue: "none.png"
    },
    location: {
      type: DataTypes.STRING(config.location),
      allowNull: true
    },
    defaultCalendarId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'calendars',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "login",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "login" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "defaultCalendarId",
        using: "BTREE",
        fields: [
          { name: "defaultCalendarId" },
        ]
      },
    ]
  });
};
