const Entity = require('./entity.js');
 
module.exports = class users_calendars extends Entity{
    constructor(sequelModel) {
        super(sequelModel);
    };

    async set(userId, calendarId, role){
        const relation = await super.getOne({
            userId: userId,
            calendarId: calendarId
        });
        
        if (relation) {
            relation.role = role;
            return await relation.save();   
        }

        return await this.sequelModel.create({
            userId: userId,
            calendarId: calendarId,
            role: role 
        })
    };

    async delete(searchObj) {
        await this.sequelModel.destroy({
            where: searchObj
        });
    }
}