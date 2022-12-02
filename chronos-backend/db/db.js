const config = require('./dbConfig.json');
const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');

const _calendars = require("./sequelizeModels/calendars");
const _events = require("./sequelizeModels/events");
const _events_calendars = require("./sequelizeModels/events_calendars");
const _users = require("./sequelizeModels/users");
const _users_calendars = require("./sequelizeModels/users_calendars");
//

module.exports = class DataBase {
    constructor() {
        const sequelize = new Sequelize(config.database, 
            config.user, config.password, config.params)
        
        this.sequelize = sequelize;
        
        // Initializin all models
        const calendars = _calendars(sequelize, DataTypes);
        const events = _events(sequelize, DataTypes);
        const events_calendars = _events_calendars(sequelize, DataTypes);
        const users = _users(sequelize, DataTypes);
        const users_calendars = _users_calendars(sequelize, DataTypes);

        events_calendars.belongsTo(calendars, { as: "calendar", foreignKey: "calendarId", onDelete:'CASCADE'});
        calendars.hasMany(events_calendars, { as: "events_calendars", foreignKey: "calendarId"});
        users.belongsTo(calendars, { as: "defaultCalendar", foreignKey: "defaultCalendarId"});
        calendars.hasMany(users, { as: "users", foreignKey: "defaultCalendarId"});
        users_calendars.belongsTo(calendars, { as: "calendar", foreignKey: "calendarId", onDelete:'CASCADE'});
        calendars.hasMany(users_calendars, { as: "users_calendars", foreignKey: "calendarId"});
        events_calendars.belongsTo(events, { as: "event", foreignKey: "eventId", onDelete:'CASCADE'});
        events.hasMany(events_calendars, { as: "events_calendars", foreignKey: "eventId"});
        events.belongsTo(users, { as: "admin", foreignKey: "adminId"});
        users.hasMany(events, { as: "events", foreignKey: "adminId"});
        users_calendars.belongsTo(users, { as: "user", foreignKey: "userId"});
        users.hasMany(users_calendars, { as: "users_calendars", foreignKey: "userId"});

        this.__syncModels();
        console.log(this.sequelize.models);
    }

    __end() {
        this.sequelize.close();
    }

    async __syncModels() {
        await this.sequelize.sync({ alter: true });
    }
}