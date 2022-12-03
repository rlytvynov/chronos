const controller = require('./controllers/controllCalendar.js');

module.exports = function (server, opts, done) {
    server.get('/api/calendars/:calendarId', controller.getOne);
    server.get('/api/calendars', controller.getAllRaw);
    server.get('/api/calendars-events', controller.getAll);
    server.get('/api/calendars-holidays/:date', controller.getHoliday);

    server.post('/api/calendars', controller.set);

    server.post('/api/calendars/:calendarId/invite/:login', controller.invite);
    server.get('/api/calendars/acceptInvitation/:token', controller.inviteConfirmer);

    server.patch('/api/calendars/:calendarId', controller.edit);
    server.patch('/api/calendars/:calendarId/role', controller.editRole);
    
    server.delete('/api/calendars/:calendarId', controller.delete);

    done();
}