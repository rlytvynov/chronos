const Entity = require('./entity.js');
 
module.exports = class Event extends Entity{
    constructor(sequelModel) {
        super(sequelModel);
    };

    async get(eventId){
        return await super.getOne({id: eventId});
    }

    async getAll(events_calendars, calendarId) {
        return await this.sequelModel.findAll({
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