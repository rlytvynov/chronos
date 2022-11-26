// Fastify reqs
const Fastify = require('fastify').default,
      FastifyStatic = require('@fastify/static'),
      FastifyFormbody = require('@fastify/formbody'),
      FatsifyJWT = require('@fastify/jwt'),
      FastifyCookies = require('@fastify/cookie'),
      FastifyMultipart = require('@fastify/multipart');
// Other useful reqs
const Path = require('path');
// const names
const PORT = 8888,
      CURRENTDIR = __dirname;
// db parts
const DataBase = require('./db/db.js'),
      db = new DataBase();
// configs
const jwtConfig = require('./utils/jwtConfig.json');


// server instance
const server = Fastify({
    logger: false,
    maxParamLength: 1000 
});


// register middleware
server.register(FastifyCookies, {
    secret: 'my-secret',
    hook: 'onRequest'
});
server.register(FastifyFormbody);
server.register(FastifyMultipart);
server.register(FatsifyJWT, jwtConfig.loginToken);
server.register(FastifyStatic, {
    root: Path.join(CURRENTDIR, 'public')
});

// decorators
server.decorateReply('sendAuthToken', function (id, login) {
    const AuthToken = server.jwt.sign({id:id, login:login});
    this.status(200) // this means reply
    .setCookie('AuthToken', AuthToken, {path: '/'})
    .setCookie('login', login, {path: '/'});
});
// Hooks
// we bond 
server.addHook('onRequest', function(request, reply, done) {
    request.db = db;
    request.jwt = server.jwt;
    done();
});
server.addHook('onRequest', function(request, reply, done) {
    if(!request.cookies.AuthToken)
        done();
    try {
        server.jwt.verify(request.cookies.AuthToken, (err, payload)=> {
            request.user = {
                id: payload.id,
                login: payload.login,
            };
        });
    } catch (error) {
        // guess you should be registered to enter the app
        // will change this later

        /* TODO LIST:
        // 0: cout
        // 1: Nothing
        // 2: NOTHING
        // 3: absolutely nothing
        // 4: le me think.... nothin
        */
    }
    done();
});


// routes
server.register(require('./routes/routesAuth.js'));     // Auth
server.register(require('./routes/routesUser.js'));     // User
server.register(require('./routes/routesCalendar.js')); // Calendar
server.register(require('./routes/routesEvent.js'));    // Event

// server starter
server.listen({port: PORT}, function(err, adres){
    if(err) {
        console.log(err);
        process.exit(1);
    }
});
