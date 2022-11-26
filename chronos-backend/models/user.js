const Entity = require('./entity.js'),
      CustomError = require('./errors.js');

//const UserAttributes = ['login', 'fullName', 'email', 'profilePic'];
const UserExcludeArr = ['email', 'password', 'location', 'defaultCalendarId', 'updatedAt'];
const chunkSize = 20;

module.exports = class User extends Entity{
    constructor(sequelModel) {
        super(sequelModel);
    };

    async getAll(chunk = 1) {
        return await this.getPagination(chunkSize * (chunk - 1), 
        chunkSize, UserExcludeArr);
    };

    async get(searchObj, isInner = false) {
        const exclude = isInner ? [] : UserExcludeArr;
        return await super.getOne(searchObj, exclude);
    }

    async create(login, password, email, fullName) {
        const [pawn, created] = await this.sequelModel.findOrCreate({
            where: {
                [this.Op.or]: [
                    { login: login },
                    { email: {
                        [this.Op.like]: '%' + email
                    }}
                ]
            },
            defaults: {
                login: login,
                email: '@@' + email,
                fullName: fullName,
                password: password
            }
        });
        return [pawn, created];
    };

    async edit(newData, searchObj) {
        this.insertionProtector(newData);
        const pawn = await this.get(searchObj, true);
        for (const key in newData) {
            if (Object.hasOwnProperty.call(newData, key)) {
                if (newData[key]) {
                    pawn[key] = newData[key];
                }
            }
        }

        await pawn.save();
    };
}
