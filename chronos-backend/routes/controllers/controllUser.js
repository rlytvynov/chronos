const {pipeline} = require('stream'),
      Util = require('util'),
      Fs = require('fs'),
      {v4: uuidv4} = require('uuid'),
      Pump = Util.promisify(pipeline);

const User = require('../../models/user.js'),
      Mailer = require('../../utils/mailer.js'),
      CustomError = require('../../models/errors.js'),
      hashPassword = require('../../utils/hasher.js'),
      jwtConfig = require('../../utils/jwtConfig.json'),
      errorReplier = require('../../utils/errorReplier.js'),
      insertionProtector = require('../../utils/insertionProtector.js');

const idChecker = (id, errCode) => {
    if (!id || id === null || isNaN(id)) {
        throw new CustomError(errCode)
    }
}

module.exports = {
    getAll : async (request, reply) => {
        try {
            const userModel = new User(request.db.sequelize.models.users);
            const usersArray = await userModel.getAll(request.query.chunk);
            reply.status(200).send(usersArray);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    get : async(request, reply) => {
        try {
            if (!request.params) throw new CustomError(1023);
            const userModel = new User(request.db.sequelize.models.users);
            let user = {};
            if (request.params.userId && request.params.userId !== null
            && !isNaN(request.params.userId))
                user = await userModel.get({id: request.params.userId});
            else if (request.params.login)
                user = await userModel.get({login: request.params.login});
            else throw new CustomError(1023);
        
            reply.status(200).send(user);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    getAvatar : async(request, reply) => {
        try {
            if (!request.params || !request.params.avatarName)
                throw new CustomError(1023);
            const buffer = Fs.readFileSync('./public/profilePics/' + request.params.avatarName)
            reply.status(200).send(buffer);
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    /*deleteUser : async(request, reply) => {
        try {
            if (!request.params || request.params.userId == null
            || isNaN(request.params.userId))
                throw new CustomError(1023);
            const user = new User(request.db.sequelize.models.users);
            if (!request.user)
                throw new CustomError(1006);
            else {
                const pawn = await user.getOneById(request.params.userId);
                if (pawn.login != request.user.login)
                    throw new CustomError(1006);
            }
            await user.deleteByCols({id: request.params.userId});
        } catch (error) {
            errorReplier(error, reply);
        }
    },*/

    edit : async(request, reply) => {
        try {
            idChecker(request.user.id, 1006);

            const {login, email, password, fullName, location} = request.body;
            insertionProtector({email: email, login: login, location: location});

            const user = new User(request.db.sequelize.models.users);
            const pawn = await user.get({id: request.user.id}, true);

            if (login) {
                if (login === pawn.login)
                    throw new CustomError(1007);
                const pawnByNewLogin = await user.get({login: login});
                if (pawnByNewLogin)
                    throw new CustomError(1004);
            }

            await user.edit({login, fullName, location}, {id: request.user.id});

            if (email) {
                if (pawn.dataValues.email === email) throw new CustomError(1008);
                const pawnByMail = await user.get({email: { [user.Op.like]: '%' + email}});
                if (pawnByMail) throw new CustomError(1005);

                const mailer = new Mailer();
                mailer.sendConfirmEmail(email, request.jwt.sign({
                    email: email,
                    login: request.user.login
                }, jwtConfig.mailToken.secret, jwtConfig.mailToken.sign));
            }
            if(password) {
                const mailer = new Mailer();
                mailer.sendPasswordReset(pawn.dataValues.email, request.jwt.sign({
                    newPassword: hashPassword(password),
                    login: request.user.login
                }, jwtConfig.passToken.secret, jwtConfig.passToken.sign));
            }
            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    editAvatar : async(request, reply) => {
        try {
            if (!request.user || !request.user.login)
                throw new CustomError(1006);
            
            const avatarName = request.user.login + '_' + uuidv4() + '.png';
            const avatarPath = './public/profilePics/' + avatarName;
            const data = await request.file();

            const user = new User(request.db.sequelize.models.users);
            const previousPawn = await user.getOne({login: request.user.login});
            await user.edit({profilePic: avatarName}, {login: request.user.login});

            if (previousPawn.profilePic !== 'none.png') {
                Fs.unlink('./public/profilePics/' + previousPawn.profilePic, (error) => {
                    if (error) console.log(error);
                });
            }
            await Pump(data.file, Fs.createWriteStream(avatarPath));

            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    editLocation : async(request, reply) => {
        try {
            idChecker(request.user.id, 1006);
            if (!request.body.latitude || !request.body.longitude)
                throw new CustomError(1025);
            const GEONAMES_LOGIN = 'deds_dev_xyecoc_int';
            console.log(request.body.latitude); console.log(request.body.longitude)
            const url = `http://api.geonames.org/countryCodeJSON?lat=${request.body.latitude}&lng=${request.body.longitude}&username=${GEONAMES_LOGIN}`;
            const geonamesResponse = await (await fetch(url)).json();
            const user = new User(request.db.sequelize.models.users);
            await user.edit({location: geonamesResponse.countryCode.toLowerCase()}, {id: request.user.id});

            reply.status(200).send({message: "Success"});
        } catch (error) {
            errorReplier(error, reply);
        }
    },

    search : async(request, reply) => {
        try {
            if (!request.user || !request.user.id)
                throw new CustomError(1006);
            if (!request.params.findLoginStr) throw new CustomError(1023);
            insertionProtector(request.params.findLoginStr);

            const user = new User(request.db.sequelize.models.users);
            const pawns = await user.getLike('login', request.params.findLoginStr);

            reply.status(200).send(pawns);
        } catch (error) {
            errorReplier(error, reply);
        }
    }
}
