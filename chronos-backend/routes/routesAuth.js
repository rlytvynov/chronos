const controler = require('./controllers/controllAuth.js');

module.exports = function (server, opts, done) {
    server.post('/api/auth/login', controler.loginer);
    server.post('/api/auth/register', controler.register);
    server.get('/api/auth/logout', controler.logouter);
<<<<<<< HEAD
    server.post('/api/auth/me', controler.authMe);
=======
>>>>>>> 6aa270343de5a561f3aad0cf9e7748939c075919
    server.post('/api/auth/passwordReset', controler.reseter);
    server.get('/api/auth/passwordReset/:token', controler.resetConfirmer);
    server.get('/api/auth/confirmEmail/:token', controler.mailConfirmer);
    
    server.get('/api/check/me', controler.authMe);

    done();
}
