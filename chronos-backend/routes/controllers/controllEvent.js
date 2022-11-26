const User = require('../../models/user.js'),
      Mailer = require('../../utils/mailer.js'),
      Event = require('../../models/event.js'),
      Calendar = require('../../models/calendar.js'),
      idChecker = require('../../utils/idChecker.js'),
      CustomError = require('../../models/errors.js'),
      errorReplier = require('../../utils/errorReplier.js'),
      Events_Calendars = require('../../models/events_calendars.js'),
      insertionProtector = require('../../utils/insertionProtector.js');

module.exports = {
    getOne : async (request, reply) => {
        try {
            idChecker(request.params.eventId, 1023);
            idChecker(request.user.id, 1006);

            const events_calendars = new Events_Calendars(request.db.sequelize.models.events_calendars)
            


            reply.status(200).send(event);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getAll : async (request, reply) => {
        try {
            idChecker(request.params.calendarId, 1023);
            idChecker(request.user.id, 1006);
            
            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const [calendar] = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id,
                request.params.calendarId
            );

            if(!calendar) throw new CustomError(1023);

            const eventModel = new Event(request.db.sequelize.models.events);
            const events = await eventModel.get(
                request.db.sequelize.models.events_calendars,
                null,
                request.params.calendarId
            );

            reply.status(200).send(events);
        } catch (error) {
            errorReplier(error, reply);
        }
    }
}