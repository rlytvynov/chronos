const controller = require('./controllers/controllCalendar.js');

module.exports = function (server, opts, done) {
    server.get('/api/calendars/:calendarId', controller.getOne);
    server.get('/api/calendars', controller.getAll);
    server.post('/api/calendars', controller.set);
    server.post('/api/calendars/:calendarId', controller.invite);
    server.patch('/api/calendars/:calendarId', controller.edit);
    server.patch('/api/calendars/role/:calendarId', controller.editRole)
    server.delete('/api/calendars/:calendarId', controller.delete);

    done();
}