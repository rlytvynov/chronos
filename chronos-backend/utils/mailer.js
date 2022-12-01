const config = require('./mailConfig.json');

module.exports = class Mailer {
    constructor(){
        this.transporter = require('nodemailer').createTransport(config.transport);
    };

    FrontAddress = 'http://localhost:3000';


    sendPasswordReset(email, token) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Password reset confirmation',
            html: `You can reset your password by this URL:
            <a href="${this.FrontAddress}/passwordReset/${token}">\
            Reset password! </a>`,
            }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    };

    sendConfirmEmail (email, token) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Email confirmation',
            html: `You can confirm your email by this URL: (button) \
            <a href="${this.FrontAddress}/confirmEmail/${token}">\
            Confirm Email!</a>`,
        }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    };

    sendInviteCalendar(email, token, login, title) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Chronos calendar invitation',
            html: `${login} have invited you to their calendar: ${title} \n \
            Follow the link \
            <a href="${this.FrontAddress}/calendars/acceptInvitation/${token}">\
            follow</a> to join the calendar and track common events.`,
        }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    };

    sendInviteEvent(email, token, login, title) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Chronos event invitation',
            html: `${login} have invited you to their event: ${title} \n \
            Follow the link \
            <a href="${this.FrontAddress}/events/acceptInvitation/${token}">\
            follow</a> to join the event.`,
        }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    }
}