const controller = require('./controllers/controllEvent.js');

module.exports = function (server, opts, done) {
    server.get('/api/events/event=:eventId', controller.getOne);
    server.get('/api/events/calendar=:calendarId', controller.getAll);
    server.get('/api/events/calendar=:calendarId/start=:leftBorder-end=:rightBorder', controller.getAll);
    
    
    
    server.post('/api/events/calendar=:calendarId', controller.set);
    server.post('/api/events/event=:eventId/invite/user=:login', controller.invite);
    server.get('/api/events/acceptInvitation/:token', controller.inviteConfirmer);

    server.patch('/api/events/event=:eventId', controller.edit);
    server.patch('/api/events/calendar=:calendarId-event=:eventId/move', controller.move);

    server.delete('/api/events/event=:eventId', controller.delete);
    server.delete('/api/events/calendar=:calendarId-event=:eventId', controller.unlink);


    done();
}