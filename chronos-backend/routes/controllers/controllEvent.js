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
            // I cannot check if user has access to the event, so assume 
            // if they have id, they can view it

            const eventModel = new Event(request.db.sequelize.models.events);
            const event = await eventModel.get(request.params.eventId);

            reply.status(200).send(event);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getAll : async (request, reply) => {
        try {
            idChecker(request.params.calendarId, 1023);
            idChecker(request.user.id, 1006);
            insertionProtector({leftBorder: request.params.leftBorder});
            insertionProtector({rightBorder: request.params.rightBorder});
            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const [calendar] = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id,
                request.params.calendarId
            );
            
            console.log(request.params);
            if(!calendar) throw new CustomError(1017);

            const eventModel = new Event(request.db.sequelize.models.events);
            const events = await eventModel.getAll(
                request.db.sequelize.models.events_calendars,
                request.params.calendarId,
                request.params.leftBorder,
                request.params.rightBorder
            );

            reply.status(200).send(events);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    set : async (request, reply) => {
        try {
            idChecker(request.params.calendarId, 1023);
            idChecker(request.user.id, 1006);
            
            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const [calendar] = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id,
                request.params.calendarId
            );

            if(!calendar) throw new CustomError(1017);
            else if(calendar.role == 'user') throw new CustomError(1031);
            
            const {title, description, type, color, startsAt, endsAt} = request.body;
            const data = {title: title, description: description, type: type, 
            color: color, startsAt: startsAt, endsAt: endsAt, adminId: request.user.id};
            insertionProtector(data);

            const eventModel = new Event(request.db.sequelize.models.events);
            const event = await eventModel.set(data);
            const events_calendars = new Events_Calendars(request.db.sequelize.models.events_calendars);
            await events_calendars.set(event.id, request.params.calendarId);

            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    edit : async (request, reply) => {
        try {
            idChecker(request.params.eventId, 1023);
            idChecker(request.user.id, 1006);

            const eventModel = new Event(request.db.sequelize.models.events);
            const event = await eventModel.get(request.params.eventId);

            if(!event) throw new CustomError(1023);
            else if(event.adminId != request.user.id) 
                throw new CustomError(1032);
            
            const {title, description, type, color, startsAt, endsAt} = request.body;
            const data = {title: title, description: description, type: type, 
            color: color, startsAt: startsAt, endsAt: endsAt};
            insertionProtector(data);

            await eventModel.set(data, event.id);

            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    move : async (request, reply) => {
        try {
            idChecker(request.params.eventId, 1023);
            idChecker(request.params.calendarId, 1023);
            idChecker(request.body.targetId, 1025);
            idChecker(request.user.id, 1006);

            console.log(request.body.targetId);

            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const [calendar] = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id,
                request.params.calendarId
            );
            const [target] = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id,
                request.body.targetId
            );

            if(!calendar) throw new CustomError(1017);
            if(!target) throw new CustomError(1017);
            else if(calendar.role == 'user') throw new CustomError(1034);
            else if(target.role == 'user') throw new CustomError(1031);

            const events_calendars = new Events_Calendars(request.db.sequelize.models.events_calendars);
            const relationPrevious = await events_calendars.getOne({
                eventId: request.params.eventId, 
                calendarId: request.params.calendarId
            });
            if(!relationPrevious) throw new CustomError(1023);

            const relation = await events_calendars.getOne({
                eventId: request.params.eventId, 
                calendarId: request.body.targetId
            });
            if(relation) throw new CustomError(1023);
            await events_calendars.set(request.params.eventId, request.body.targetId);

            if (request.body.isDelete){
                await events_calendars.delete({
                    eventId: request.params.eventId, 
                    calendarId: request.params.calendarId
                });
            }

            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    unlink : async (request, reply) => {
        try {
            idChecker(request.params.eventId, 1023);
            idChecker(request.user.id, 1006);
            idChecker(request.params.calendarId, 1023);

            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const [calendar] = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id,
                request.params.calendarId
            );

            if(!calendar) throw new CustomError(1017);
            else if(calendar.role == 'user') throw new CustomError(1033);
            const events_calendars = new Events_Calendars(request.db.sequelize.models.events_calendars);
            await events_calendars.delete({
                eventId: request.params.eventId,
                calendarId: request.params.calendarId
            });

            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    delete : async (request, reply) => {
        try {
            idChecker(request.params.eventId, 1023);
            idChecker(request.user.id, 1006);

            const eventModel = new Event(request.db.sequelize.models.events);
            const event = await eventModel.get(request.params.eventId);

            if(!event) throw new CustomError(1023);
            else if(event.adminId != request.user.id)
                throw new CustomError(1035);
            await eventModel.delete({id: request.params.eventId});

            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    }
}