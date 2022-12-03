const fetch = require('node-fetch'),
      User = require('../../models/user.js'),
      Mailer = require('../../utils/mailer.js'),
      Calendar = require('../../models/calendar.js'),
      idChecker = require('../../utils/idChecker.js'),
      CustomError = require('../../models/errors.js'),
      errorReplier = require('../../utils/errorReplier.js'),
      Users_Calendars = require('../../models/users_calendars.js'),
      insertionProtector = require('../../utils/insertionProtector.js')
      regionConverter = require('../../utils/iso3166_2_letter_codes.js');
//

module.exports = {
    getOne : async (request, reply) => {
        try {
            idChecker(request.params.calendarId, 1023);
            idChecker(request.user.id, 1006);
            
            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const [calendar] = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id,
                request.params.calendarId
            );
            reply.status(200).send(calendar);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getAllRaw : async (request, reply) => {
        try {
            idChecker(request.user.id, 1006);
            
            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const calendars = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id
            );

            reply.status(200).send(calendars);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getAll : async (request, reply) => {
        try {
            idChecker(request.user.id, 1006);
            const queryData = request.query
            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const calendars = await calendarModel.getAll(
                request.db.sequelize.models.users_calendars,
                request.user.id,
                request.db.sequelize.models.events_calendars,
                request.db.sequelize.models.events
            );

            reply.status(200).send(paginate(calendars, 4, queryData.page ? Number(queryData.page) : 1));
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

            const date = new Date(Number.parseInt(request.params.date));
            const CALENDAR_REGION = regionConverter[request.user.location.toLowerCase()];

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
            idChecker(request.user.id, 1006);
            const title = request.body.title;
            const description = request.body.description;
            if (!title || !description)
                throw new CustomError(-999);
            insertionProtector({title: title, description: description});

            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const users_calendars = new Users_Calendars(request.db.sequelize.models.users_calendars);
            const calendar = await calendarModel.set({title: title, description: description});
            await users_calendars.set(request.user.id, calendar.id, 'master');

            reply.status(200).send({message: 'Calendar succesfully created!'});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    invite : async (request, reply) => {
        try {
            idChecker(request.params.calendarId, 1023);
            idChecker(request.user.id, 1006);
            if(!request.params.login) throw new CustomError(1023);
            insertionProtector({invitedLogin: request.params.login});

            const user = new User(request.db.sequelize.models.users);
            const pawnInvited = await user.get({login: request.params.login}, true);
            if (!pawnInvited) throw new CustomError(1014);

            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const [calendar] = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id, 
                request.params.calendarId, 
                true
            );
            
            if(!calendar)
                throw new CustomError(1023);
            else if(calendar.users_calendars[0].role == 'user')
                throw new CustomError(1015);

            const users_calendars = new Users_Calendars(request.db.sequelize.models.users_calendars);
            const existingRelation = await users_calendars.getOne({
                userId: pawnInvited.id,
                calendarId: request.params.calendarId
            });
            if (existingRelation) 
                throw new CustomError(1016);
            
            const mailer = new Mailer();
            mailer.sendInviteCalendar(pawnInvited.email,
                request.jwt.sign({
                    userId: pawnInvited.id,
                    calendarId: request.params.calendarId
                }),
                request.user.login,
                calendar.title                
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
                const users_calendars = new Users_Calendars(request.db.sequelize.models.users_calendars);
                await users_calendars.set(payload.userId, payload.calendarId, 'user');
            });

            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    edit : async (request, reply) => {
        try {
            idChecker(request.params.calendarId, 1023);
            idChecker(request.user.id, 1006);
            const {title, description} = request.body;

            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const [calendar] = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id, 
                request.params.calendarId, 
                false
            );

            if (!calendar)
                throw new CustomError(1023)
            if (calendar.users_calendars[0].role == 'user')
                throw new CustomError(1012);
            await calendarModel.set(
                {title: title, description: description}, 
                request.params.calendarId
            );

            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    editRole : async (request, reply) => {
        try {
            idChecker(request.params.calendarId, 1023);
            idChecker(request.user.id, 1006);
            idChecker(request.body.userId, 1014);

            if (request.body.userId == request.user.id)
                throw new CustomError(-999);
            if(request.body.role != 'user' 
            && request.body.role != 'moder') 
                throw new CustomError(-999);
            
            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const [calendar] = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id, 
                request.params.calendarId, 
                true
            );    
            
            if (!calendar)
                throw new CustomError(1023);
            if (calendar.users_calendars[0].role != 'master')
                throw new CustomError(1013);
            const users_calendars = new Users_Calendars(request.db.sequelize.models.users_calendars);
            await users_calendars.set(request.params.calendarId ,request.body.userId, request.body.role);

            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    delete : async (request, reply) => {
        try {
            idChecker(request.params.calendarId, 1023);
            idChecker(request.user.id, 1006);
            
            const pawn = new User(request.db.sequelize.models.users);
            if (pawn.defaultCalendarId == request.params.calendarId)
                throw new CustomError(1011);

            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const calendar = await calendarModel.get(
                request.db.sequelize.models.users_calendars,
                request.user.id,
                request.params.calendarId,
                true
            );

            if (!calendar)
                throw new CustomError(1023);
            if (calendar[0].users_calendars[0].role == 'master') {
                await calendarModel.delete({
                    id: request.params.calendarId
                });
            }
            else {
                const users_calendars = new Users_Calendars(request.db.sequelize.models.users_calendars);
                await users_calendars.delete({
                    userId: request.user.id,
                    calendarId: request.params.calendarId
                });
            }
            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    }
}

function paginate(array, page_size, page_number) {
    return {
        totalItems: array.length,
        itemsCountPerPage: page_size,
        totalPages: Math.ceil(array.length / page_size),
        currentPage: page_number,
        calendars: array.slice((page_number - 1) * page_size, page_number * page_size)
    }
}