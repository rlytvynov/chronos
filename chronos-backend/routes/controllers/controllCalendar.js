const User = require('../../models/user.js'),
      Mailer = require('../../utils/mailer.js'),
      Calendar = require('../../models/calendar.js'),
      idChecker = require('../../utils/idChecker.js'),
      CustomError = require('../../models/errors.js'),
      errorReplier = require('../../utils/errorReplier.js'),
      Users_Calendars = require('../../models/users_calendars.js'),
      insertionProtector = require('../../utils/insertionProtector.js');


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
            
            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const calendars = await calendarModel.getAll(
                request.db.sequelize.models.users_calendars,
                request.user.id,
                request.db.sequelize.models.events_calendars,
                request.db.sequelize.models.events
            );

            reply.status(200).send(calendars);
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
            idChecker(request.params.userId, 1006);

            const user = new User(request.db.sequelize.models.users);
            const pawnInvited = await user.get({id: request.params.userId}, true);
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
            else if(calendar.role == 'user')
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
                pawnInvited.login,
                calendar.title                
            );

            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    inviteConfirmer : async(request, reply) => {
        try {
            const {token} = request.params;
            if(!token) throw new CustomError(-999);

            request.jwt.verify(token, async (err, payload) => {
                if(err) throw new CustomError(1024);
                const users_calendars = new Users_Calendars(request.db.sequelize.models.users_calendars);
                await users_calendars.set(payload.userId, payload.calendarId, 'user');
            });

            reply.status(204).send();
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
            if (calendar.role == 'user')
                throw new CustomError(1012);
            await calendarModel.set(
                {title: title, description: description}, 
                request.params.calendarId
            );

            reply.status(204).send();
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

            reply.status(204).send();
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

            reply.status(204).send();
        } catch (error) {
            errorReplier(error, reply);
        }
    }
}