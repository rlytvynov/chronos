const Entity = require('./entity.js');
 
module.exports = class Event extends Entity{
    constructor(sequelModel) {
        super(sequelModel);
    };

    async get(eventId){
        return await super.getOne({id: eventId});
    }

    async getByCalendar(events_calendars, calendarId, borderLeft, borderRight) {
        const searchObj = {}
        if (borderLeft) // we want to get events that were ongoing on the left border
            searchObj.end = {[this.Op.gte]: borderLeft};
        if (borderRight) // we want to get events that started before right border
            searchObj.start = {[this.Op.lte]: borderRight};

        return await this.sequelModel.findAll({
            where: searchObj,
            raw: true,
            include:[{
                model: events_calendars,
                as: 'events_calendars',
                where: {calendarId: calendarId},
                attributes: [],
                raw: true
            }]
        })
    }

    async getUser(userId, events_calendars, calendars, users_calendars) {
        return await this.sequelModel.findAll({
            where: searchObj,
            raw: true,
            include:[{
                model: events_calendars,
                as: 'events_calendars',
                raw: true,
                include:[{
                    model: calendars,
                    as: 'calendar',
                    raw: true,
                    include:[{
                        model: users_calendars,
                        as: 'users_calendars',
                        where: {userId: userId},
                        raw: true
                    }]
                }]
            }]
        })
    };

    async getAll(userId, events_calendars, calendars, users_calendars, borderLeft, borderRight) {
        const searchObj = {}
        if (borderLeft) // we want to get events that were ongoing on the left border
            searchObj.end = {[this.Op.gte]: borderLeft};
        if (borderRight) // we want to get events that started before right border
            searchObj.start = {[this.Op.lte]: borderRight};
        
        return await this.sequelModel.findAll({
            where: searchObj,
            raw: true,
            include:[{
                model: events_calendars,
                as: 'events_calendars',
                raw: true,
                required: true,
                include:[{
                    model: calendars,
                    as: 'calendar',
                    raw: true,
                    required: true,
                    include:[{
                        model: users_calendars,
                        as: 'users_calendars',
                        where: {userId: userId},
                        raw: true,
                        required: true
                    }]
                }]
            }]
        });
    };

    async getLike(attribute, value, userId, events_calendars, calendars, users_calendars) {
        return await this.sequelModel.findAll({
            where: {[attribute]: {
                [this.Op.like]: '%' + value + '%'
            }},
            raw: true,
            include:[{
                model: events_calendars,
                as: 'events_calendars',
                raw: true,
                required: true,
                include:[{
                    model: calendars,
                    as: 'calendar',
                    raw: true,
                    required: true,
                    include:[{
                        model: users_calendars,
                        as: 'users_calendars',
                        where: {userId: userId},
                        raw: true,
                        required: true
                    }]
                }]
            }]
        });
    }

    async set(data, id) {
        if (id) {
            return await this.sequelModel.update(
            data, 
            {
                where: {id: id}
            })
        }

        return await this.sequelModel.create(data);
    }
}