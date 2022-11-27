// Fastify reqs
const Fastify = require('fastify').default,
      FastifyStatic = require('@fastify/static'),
      FastifyFormbody = require('@fastify/formbody'),
      FatsifyJWT = require('@fastify/jwt'),
      FastifyCookies = require('@fastify/cookie'),
      FastifyMultipart = require('@fastify/multipart');
      FastifyCors = require('@fastify/cors')
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
server.register(FatsifyJWT, {secret: jwtConfig.secret, expiresIn: '60d'});
server.register(FastifyCors, {origin: 'http://localhost:3000', credentials: true })
server.register(FastifyStatic, {
    root: Path.join(CURRENTDIR, 'public'),
});

// decorators
server.decorateReply('sendAuthToken', function (pawn, isRefresh = true) {
    const data = ({
        id: pawn.id,
        login: pawn.login,
        fullName: pawn.fullName,
        email: pawn.email,
        profilePic: pawn.profilePic,
        location: pawn.location,
        defaultCalendarId: pawn.defaultCalendarId
    });
    this.status(200) // 'this' means reply

    if (isRefresh){
        const refreshToken = server.jwt.sign(data, {expiresIn: jwtConfig.refreshToken.expiresIn});
        this.setCookie('refreshToken', refreshToken, 
        {path: '/', 
        httpOnly: true, //protect from XSS(malicious client side script )
        maxAge: 5000*1000}
    )
    }
    const accessToken = server.jwt.sign(data, {expiresIn: jwtConfig.accessToken.expiresIn});
    data.accessToken = accessToken;
    this.send(data);
});
// Hooks
// we bond 
server.addHook('onRequest', function(request, reply, done) {
    request.db = db;
    request.jwt = server.jwt;
    done();
});

server.addHook('onRequest', function(request, reply, done) {  
    if (request.url.includes('/auth/')
    || request.url.includes('/users/avatar/')){
        return done();
    }
    
    const token = request.headers.authorization

    if (!token){
        reply.status(403).send({ message: 'No access' });
        return done();
    }
    
    try {
        request.jwt.verify(token, (error, payload) => {
            if (error) throw error;
            request.user = payload;
        })
    } catch (error) { }
    done();
});

// routes
server.register(require('./routes/routesAuth.js'));     // Auth
server.register(require('./routes/routesUser.js'));     // User
server.register(require('./routes/routesCalendar.js')); // Calendar
server.register(require('./routes/routesEvent.js'));    // Event

// server starter
server.listen({port: PORT}, function(err, adres){
    console.log(PORT)
    if(err) {
        console.log(err);
        process.exit(1);
    }
});
