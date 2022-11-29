const Entity = require('./entity.js'),
      CustomError = require('./errors.js');
 
module.exports = class Calendar extends Entity{
    constructor(sequelModel) {
        super(sequelModel);
    };

    async get(users_calendars, userId, calendarId = null, isInner = false) {
        let searchCalendar = {};
        if (calendarId) searchCalendar = {id: calendarId};

        if(!isInner){
            return await this.sequelModel.findAll({
                attributes: ['id', 'title', 'description', 'users_calendars.role'],
                raw: true,
                where: searchCalendar,
                include:[{
                    model: users_calendars,
                    as: 'users_calendars',
                    where: {userId: userId},
                    attributes: [],
                    raw: true
                }]
            });
        }
        return await this.sequelModel.findAll({
            where: searchCalendar,
            include:[{
                model: users_calendars,
                as: 'users_calendars',
                where: {userId: userId},
            }]
        });
    }

    async getAll(users_calendars, userId, events_calendars, events) {
        return await this.sequelModel.findAll({
            include:[
                {
                    model: users_calendars,
                    as: 'users_calendars',
                    where: {userId: userId},
                    attributes: ['role'],
                    raw: true
                },
                {
                    model: events_calendars,
                    as: 'events_calendars',
                    attributes: ['eventId'],
                    raw: true,
                    include:[{
                        model: events,
                        as: 'event',
                        attributes: [],
                        raw: true
                    }]
                }
            ]
        });      
    }

    async set(data, id){
        this.insertionProtector(data);

        if (id) {
            const calendar = await super.getOne({id: id});
            if (data.title) 
                calendar.title = data.title;
            if (data.description)
                calendar.description = data.description;
            return await calendar.save();
        }

        return await this.sequelModel.create({
            title: data.title,
            description: data.description
        });
    }
}
