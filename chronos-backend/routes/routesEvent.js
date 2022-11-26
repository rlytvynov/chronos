const controller = require('./controllers/controllEvent.js');

module.exports = function (server, opts, done) {
    server.get('/api/events/:eventId', controller.getOne);
    server.get('/api/events/calendar/:calendarId', controller.getAll);

    done();
}