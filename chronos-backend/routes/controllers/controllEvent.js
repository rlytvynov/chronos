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
            idChecker(request.user.id, 1006);
            insertionProtector({leftBorder: request.params.leftBorder});
            insertionProtector({rightBorder: request.params.rightBorder});
            console.log(request.params);
            const eventModel = new Event(request.db.sequelize.models.events);
            const events = await eventModel.getAll(
                request.user.id,
                request.db.sequelize.models.events_calendars,
                request.db.sequelize.models.calendars,
                request.db.sequelize.models.users_calendars,
                request.params.leftBorder,
                request.params.rightBorder
            );
            
            const replyArr = [];
            events.forEach(event => {
                replyArr.push({
                    id: event['id'], 
                    title: event['title'],
                    description: event['description'],
                    calendarId: event['events_calendars.calendarId'],
                    type: event['type'],
                    color: event['color'],
                    start: event['start']
                });
            });
            reply.status(200).send(replyArr);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getCalendar : async (request, reply) => {
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

            if(!calendar) throw new CustomError(1017);

            const eventModel = new Event(request.db.sequelize.models.events);
            const events = await eventModel.getByCalendar(
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

    search : async(request, reply) => {
        try {
            idChecker(request.user.id, 1006);
            if (!request.params.findStr) throw new CustomError(1023);
            insertionProtector(request.params.findStr);

            const eventModel = new Event(request.db.sequelize.models.events);
            const eventsByTitles = await eventModel.getLike(
                'title', 
                request.params.findStr,
                request.user.id,
                request.db.sequelize.models.events_calendars,
                request.db.sequelize.models.calendars,
                request.db.sequelize.models.users_calendars
            );
            const eventsByDescriptions = await eventModel.getLike(
                'description', 
                request.params.findStr,
                request.user.id,
                request.db.sequelize.models.events_calendars,
                request.db.sequelize.models.calendars,
                request.db.sequelize.models.users_calendars
            );

            const replyArr = [];
            function arrayLooper(toLoop, toAnswer) {
                toLoop.forEach(event => {
                    toAnswer.push({
                        id: event['id'], 
                        title: event['title'],
                        description: event['description'],
                        calendarId: event['events_calendars.calendarId']
                    });
                });
            };

            arrayLooper(eventsByTitles, replyArr);
            arrayLooper(eventsByDescriptions, replyArr);  

            reply.status(200).send(replyArr);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getHoliday : async (request, reply) => {
        try {
            idChecker(request.user.id, 1006);
            insertionProtector({date: request.params.date});
            if (!request.params.date)
                throw new CustomError(1023);

            const user = new User(request.db.sequelize.models.users);
            const pawn = await user.get({id: request.user.id}, true);

            const date = new Date(Number.parseInt(request.params.date));
            const CALENDAR_REGION = regionConverter[pawn.location.toLowerCase()];

            if (!CALENDAR_REGION) {
                reply.status(400).send({message: "Location missing"});
                return;
            }

            const BASE_CALENDAR_URL = "https://www.googleapis.com/calendar/v3/calendars";
            const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY = "holiday@group.v.calendar.google.com"; 
            const API_KEY = "AIzaSyB6X8bUdtRujQfdru8R5thJG84BvJ_LPpI";

            date.setUTCHours(00, 00, 00);
            const dateMin = date.toISOString();
            date.setUTCHours(23, 59, 59);
            const dateMax = date.toISOString();

            // strings for testing
            // Army day
            // const dateMinpre = new Date('2022-12-06T00:00:00.360Z');
            // const dateMin = dateMinpre.toISOString();
            // const dateMaxpre = new Date('2022-12-06T23:59:59.360Z');
            // const dateMax = dateMaxpre.toISOString();

            const url = `${BASE_CALENDAR_URL}/en.${CALENDAR_REGION}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY}/events?key=${API_KEY}&timeMin=${dateMin}&timeMax=${dateMax}`;
            console.log(url);

            const response = await fetch(url);
            const data = await response.json();

            if (!data) throw new CustomError(-999);
            let holidays = [];
            data.items.forEach(event => {
                holidays.push({
                    title: event.summary.split('(Suspended)')[0],
                    start: event.start.date
                });
            });

            reply.status(200).send(holidays);
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
            
            const {title, description, type, color, start, end} = request.body;
            const data = {title: title, description: description, type: type, 
            color: color, start: start, end: end, adminId: request.user.id};
            insertionProtector(data);

            const eventModel = new Event(request.db.sequelize.models.events);
            const event = await eventModel.set(data);
            const events_calendars = new Events_Calendars(request.db.sequelize.models.events_calendars);
            await events_calendars.set(event.id, request.params.calendarId);

            reply.status(200).send({message: "Success!"});
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
            
            const {title, description, type, color, start, end} = request.body;
            const data = {title: title, description: description, type: type, 
            color: color, start: start, end: end};
            insertionProtector(data);

            await eventModel.set(data, event.id);

            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    invite : async (request, reply) => {
        try {
            idChecker(request.params.eventId, 1023);
            idChecker(request.user.id, 1006);
            if(!request.params.login) throw new CustomError(1023);
            insertionProtector({invitedLogin: request.params.login});
            
            const user = new User(request.db.sequelize.models.users);
            const pawnInvited = await user.get({login: request.params.login}, true);
            if (!pawnInvited) throw new CustomError(1014);
            
            const eventModel = new Event(request.db.sequelize.models.events);
            const event = await eventModel.get(request.params.eventId);
            
            if(!event) throw new CustomError(1023);
            else if(event.adminId != request.user.id) 
                throw new CustomError(1032);
            
            const [event_user] = await eventModel.getUserEvent(
                request.params.eventId,
                pawnInvited.id,
                request.db.sequelize.models.events_calendars,
                request.db.sequelize.models.calendars,
                request.db.sequelize.models.users_calendars
            );

            if (event_user)
                throw new CustomError(1036);
            // ^^^ cannot add event if user has one ^^^

            const mailer = new Mailer();
            mailer.sendInviteEvent(pawnInvited.email,
                request.jwt.sign({
                    userId: pawnInvited.id,
                    calendarId: pawnInvited.defaultCalendarId,
                    eventId: request.params.eventId
                }),
                request.user.login,
                event.title       
            );

            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    inviteConfirmer : async(request, reply) => {
        try {
            const {token} = request.params;
            if(!token) throw new CustomError(-999);
            idChecker(request.user.id, 1006);

            request.jwt.verify(token, async (err, payload) => {
                if(err) {
                    errorReplier(new CustomError(1024), reply);
                    return;
                }
                if(payload.userId != request.user.id){
                    errorReplier(new CustomError(1009), reply);
                    return;
                }
                const events_calendars = new Events_Calendars(request.db.sequelize.models.events_calendars);
                await events_calendars.set(payload.eventId, payload.calendarId);
            });

            reply.status(200).send({message: "Success"});
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

            reply.status(200).send({message: "Success"});
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

            reply.status(200).send({message: "Success"});
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

            if(!event) {
                throw new CustomError(1023);
            } else if (event.adminId != request.user.id) {
                throw new CustomError(1035);
            }
            try {
                await eventModel.delete({id: request.params.eventId});
            } catch (error) {
                console.log(error)
            }
            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    }
}