module.exports = function(sequelize, DataTypes) {
  return sequelize.define('events_calendars', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
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
    }
  }, {
    sequelize,
    tableName: 'events_calendars',
    timestamps: false,
    indexes: [
      {
        name: "eventId",
        using: "BTREE",
        fields: [
          { name: "eventId" },
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
