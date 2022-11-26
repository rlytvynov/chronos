const Entity = require('./entity.js');
 
module.exports = class Event extends Entity{
    constructor(sequelModel) {
        super(sequelModel);
    };

    async get(events_calendars, eventId = null, calendarId = null, isInner = false){
        let isRaw = true;
        let eventSelector = {};
        let calendarSelector = {};
        if(isInner)
            isRaw = false;
        if(eventId)
            eventSelector = {id: eventId};
        if(calendarId)
            calendarSelector = {calendarId: calendarId}
        
        return await this.sequelModel.findAll({
            where: eventSelector,
            raw: isRaw,
            include:[{
                model: events_calendars,
                as: 'events_calendars',
                where: calendarSelector,
                raw:isRaw
            }]
        });
    }
}