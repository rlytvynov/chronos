const Entity = require('./entity.js');
 
module.exports = class Event extends Entity{
    constructor(sequelModel) {
        super(sequelModel);
    };

    async get(eventId){
        return await super.getOne({id: eventId});
    }

    async getAll(events_calendars, calendarId, borderLeft, borderRight) {
        const searchObj = {}
        if (borderLeft) // we want to get events that were ongoing on the left border
            searchObj.end = {[this.Op.gte]: borderLeft};
        if (borderRight) // we want to get events that started before right border
            searchObj.start = {[this.Op.lte]: borderRight};
        console.log(searchObj);
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

    async getUser(eventId, userId, events_calendars, calendars, users_calendars) {
        // search if user belongs to any calendar containing needed event
        // or
        // search if event exists in any of calendars viewed by user
        return await this.sequelModel.findAll({
            where: {id: eventId},
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