module.exports = class UserErrors extends Error {
    constructor(errCode, additionalInfo, ...params) {
        super(...params);
        switch(errCode) {
            // VVV Auth/User errors (001 - 010) VVV
            case 1001:
                this.message = 'Login not found!';
                break;
            case 1002:
                this.message = 'Passwords don\'t match!';
                break;
            case 1003:
                this.message = 'You need to confirm email first';
                break;
            case 1004:
                this.message = 'Login already exists!';
                break;
            case 1005:
                this.message = 'Email already in use(';
                break;
            case 1006:
                this.message = 'You need to log in first';
                break;
            case 1007:
                this.message = 'You need to choose a different login';
                break;
            case 1008:
                this.message = 'You need to choose a different email';
                break;
            // VVV Calendar errors (011 - 020) VVV
            case 1011:
                this.message = 'You cannot delete your default calendar'
                break;
            case 1012:
                this.message = 'You have no rights to edit this calendar'
                break;
            case 1013:
                this.message = 'You have no rights to change user roles on this calendar'
                break;
            case 1014:
                this.message = 'User not found!'
                break;
            case 1015:
                this.message = 'You have no rights to invite users to this calendar!'
                break;
            case 1016:
                this.message = 'User is already following this calendar'
                break;
            // VVV Unexpected errors (021 - 030) VVV
            case 1021:
                this.message = 'Unallowed symbols at ' + additionalInfo;
                break;
            case 1022:
                this.message = 'Incorrect field Len';
                break;
            case 1023:
                this.message = 'Crappy params';
                break;
            case 1024:
                this.message = 'Invalid token';
                break;
            default:
                this.message = 'Server Errors: undefined error!';
        }
        this.errCode = errCode;
    }
}