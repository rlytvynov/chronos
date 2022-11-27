const controller = require('./controllers/controllUser.js');

module.exports = function (server, opts, done) {
    server.get('/api/users', controller.getAll);
    server.get('/api/users/:userId', controller.get);
    server.get('/api/users/login/:login', controller.get);
    server.get('/api/users/avatar/:avatarName', controller.getAvatar);
    server.patch('/api/users/avatar', controller.editAvatar);
    server.patch('/api/users', controller.edit);

    //server.post('/api/users', controller.set);
    //server.patch('/api/users/location/:userId', controller.editLocation);
    //server.delete('/api/users/:userId', controller.delete);


    done();
}
