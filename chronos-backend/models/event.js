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
            searchObj.endsAt = {[this.Op.gte]: borderLeft};
        if (borderRight) // we want to get events that started before right border
            searchObj.startsAt = {[this.Op.lte]: borderRight};
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