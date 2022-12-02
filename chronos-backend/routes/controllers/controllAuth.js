const User = require('../../models/user.js'),
      Mailer = require('../../utils/mailer.js'),
      Calendar = require('../../models/calendar.js'),
      CustomError = require('../../models/errors.js'),
      hashPassword = require('../../utils/hasher.js'),
      jwtConfig = require('../../utils/jwtConfig.json'),
      errorReplier = require('../../utils/errorReplier.js'),
      Users_Calendars = require('../../models/users_calendars.js'),
      insertionProtector = require('../../utils/insertionProtector.js');

const mailer = new Mailer();
 
module.exports = {
    loginer : async (request, reply) => {
        try{
            if (!request.body.login || !request.body.password)
                throw new CustomError(-999); // -999 po prichine idi nahui
            const user = new User(request.db.sequelize.models.users);
            user.insertionProtector(request.body);

            const pawn = await user.get({login: request.body.login}, true);
            if(!pawn)
                throw new CustomError(1001);
            else if(pawn.password != hashPassword(request.body.password))
                throw new CustomError(1002);
            else if (pawn.email.startsWith('@@'))
                throw new CustomError(1003);
            reply.sendAuthToken(pawn.dataValues);
        }catch(error) {
            errorReplier(error, reply);
        }
    },
    
    register : async (request, reply) => {
        try {
            let {login, password, email, fullName} = request.body;
            if (!login || !password || !email || !fullName)
                throw new CustomError(-999); // -999 po prichine idi nahui
            insertionProtector(request.body);

            if (login.length < 4 || password.length < 6 || fullName.length < 3)
                throw new CustomError(1022);
            password = hashPassword(password);
            const user = new User(request.db.sequelize.models.users);
            const [pawn, created] = await user.create(login, password, email, fullName);
            if (!created) {
                if (pawn.login === login)
                    throw new CustomError(1004);
                throw new CustomError(1005);
            }

            const calendarModel = new Calendar(request.db.sequelize.models.calendars);
            const calendar = await calendarModel.set({title: `Default calendar`, 
            description: `${pawn.login} default calendar`});

            const users_calendars = new Users_Calendars(request.db.sequelize.models.users_calendars);
            await users_calendars.set(pawn.id, calendar.id, 'master');

            await user.edit({defaultCalendarId: calendar.id}, {id: pawn.id});
            mailer.sendConfirmEmail(request.body.email, request.jwt.sign({
                email: request.body.email,
                login: request.body.login
            }, {expiresIn: jwtConfig.mailToken.expiresIn}));

            reply.status(200).send({msg: 'Confirm your email!'});
        } catch (error) {
            errorReplier(error, reply);
        }
    },
    
    logouter : async (request, reply) => {
        if(!request.cookies.refreshToken) reply.status(401).send();
        else reply.status(200).clearCookie('refreshToken', {path: '/'});
    },

    reseter : async (request, reply) => {
        try {
            if(!request.user || !request.user.login || !request.body.newPassword)
                throw new CustomError(-999); // -999 po prichine idi nahui
            if (request.body.newPassword.length < 6)
                throw new CustomError(1022);
            insertionProtector(request.body);

            const user = new User(request.db.sequelize.models.users);
            const pawn = await user.get({login: request.user.login}, true);

            if(!pawn)
                throw new CustomError(1001);
            else if (pawn.email.startsWith('@@'))
                throw new CustomError(1003);
            
            mailer.sendPasswordReset(pawn.email, request.jwt.sign({
                newPassword: hashPassword(request.body.newPassword),
                login: request.user.login
            }, {expiresIn: jwtConfig.passToken.expiresIn}));

            reply.status(200).send({message: "Success"});    
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    resetConfirmer : async(request, reply) => {
        try {
            const {token} = request.params;

            if(!token) throw new CustomError(-999);
            request.jwt.verify(token, async (err, payload) => {
                if(err) throw new CustomError(1024);
                const user = new User(request.db.sequelize.models.users);
                await user.edit({password: payload.newPassword}, 
                {login: payload.login});
            });
            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    mailConfirmer : async(request, reply) => {
        try {
            const {token} = request.params;
            if(!token) throw new CustomError(-999);

            request.jwt.verify(token, async (err, payload) => {
                if(err) throw new CustomError(1024);
                const user = new User(request.db.sequelize.models.users);
                await user.edit(
                    {email: payload.email}, 
                    {login: payload.login}
                );
            });
            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    authMe : async(request, reply) => {
        try {
            
            if (request.user){
                const user = new User(request.db.sequelize.models.users);
                const pawn = await user.get({id: request.user.id}, true)
                if (pawn) {
                    return reply.status(200).send({
                        id: pawn.id,
                        login: pawn.login,
                        fullName: pawn.fullName,
                        email: pawn.email,
                        profilePic: pawn.profilePic,
                        location: pawn.location,
                        defaultCalendarId: pawn.defaultCalendarId
                    })
                } else {
                    return reply.status(406).send({ message: 'Unauthorized' });
                }
            }
            
            if (!request.cookies?.refreshToken)
                return reply.status(406).send({ message: 'Unauthorized' });
            //

            // Destructuring refreshToken from cookie
            const refreshToken = request.cookies.refreshToken;

            // Verifying refresh token
            request.jwt.verify(refreshToken, (err, payload) => {
                if (err) // Wrong Refesh Token
                    return reply.status(406).send({ message: 'Unauthorized' });

                // Correct token we send a new access token
                reply.sendAuthToken(payload, false)
            })

        } catch (error) {
            return res.status(500).send({msg: error.message})
        }
    }
}