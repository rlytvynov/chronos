const Entity = require('./entity.js');
 
module.exports = class events_calendars extends Entity{
    constructor(sequelModel) {
        super(sequelModel);
    };

    async set(eventId, calendarId){
        return await this.sequelModel.create({
            eventId: eventId,
            calendarId: calendarId
        })
    };

    async delete(searchObj) {
        await this.sequelModel.destroy({
            where: searchObj
        });
    }
}