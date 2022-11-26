const AdminJS = require('adminjs'),
      AdminJSFastify = require('@adminjs/fastify'),
      AdminJSSequelize = require('@adminjs/sequelize'),
      insertionProtector = require('../utils/insertionProtector.js'),
      hashPassword = require('../utils/hasher.js');
//
const PORT = 8887;

AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
});

const ValidationError = (property, length) => {
    throw new AdminJS.ValidationError({
        name: {
            message: `${property} must be greater than ${length}`
        }
    }, {
        message: 'AdminJS: Validation Error!'
    });
}

const validateForm = (reply) => {
    const login = reply.payload.login,
          password = reply.payload.password,
          fullName = reply.payload.fullName,
          email = reply.payload.email;
    //
    if(!login || login.length < 4)
        ValidationError('login', 4);
    else if(!password || password.length < 6)
        ValidationError('password', 6);
    else if(!fullName || fullName.length < 4)
        ValidationError('fullName', 4);
    try {
        insertionProtector({login, fullName, email});
        reply.payload.password = hashPassword(reply.payload.password);
    } catch (error) {
        throw new AdminJS.ValidationError({name: {
            message: error.errText
        }},{message: 'AdminJS: Validation Error!'});
    }
    return reply;
}

async function initAdminModels(sequelizeInstance, serverInstance) {
    const adminjs = new AdminJS({
        Databases: [sequelizeInstance],
        resources: [
            {// Calendars
                resource: sequelizeInstance.models.calendars
            },
            {// Users
                resource: sequelizeInstance.models.users,
                options: {
                    properties: {
                        login: {
                            type: 'string',
                            isTitle: true  
                        },
                        password: { isVisible: true },
                        profilePic: { isVisible: true },
                    },
                    actions: {
                        edit: {
                            before: [(reply)=> {
                                const login = reply.payload.login,
                                      fullName = reply.payload.fullName,
                                      email = reply.payload.email;
                                //
                                if(!login || login.length < 4)
                                    ValidationError('login', 4);
                                else if(!fullName || fullName.length < 4)
                                    ValidationError('fullName', 4);
                                try {
                                    insertionProtector({login, fullName, email});
                                } catch (error) {
                                    throw new AdminJS.ValidationError({name: {
                                        message: error.errText
                                    }},{message: 'AdminJS: Validation Error!'});
                                }
                                return reply;
                            }]
                        },
                        new: {
                            before: [validateForm]
                        }
                    }
                }
            },
            {// Events
                resource: sequelizeInstance.models.events
            },
            {// Users_Calendars
                resource: sequelizeInstance.models.users_calendars,
                options: {
                    listProperties: ['userId', 'calendarId', 'role'],
                    filterProperties: ['userId', 'calendarId', 'role'],
                    editProperties: ['userId', 'calendarId', 'role'],
                    showProperties: ['userId', 'calendarId', 'role'],
                    /*actions: {
                        edit: {isVisible: false},
                        delete: {isVisible: false}
                    }*/
                }
            },
            {// Events_Calendars
                resource: sequelizeInstance.models.events_calendars,
                options: {
                    listProperties: ['eventId', 'calendarId'],
                    filterProperties: ['eventId', 'calendarId'],
                    editProperties: ['eventId', 'calendarId'],
                    showProperties: ['eventId', 'calendarId'],
                    /*actions: {
                        edit: {isVisible: false},
                        delete: {isVisible: false}
                    }*/
                }
            },
        ]
    });

    await AdminJSFastify.buildRouter(adminjs, serverInstance);
    console.log(`AdminJS will start on http://localhost:${PORT}${adminjs.options.rootPath}`);
};

module.exports = {initAdminModels};
