const insertionProtector = require('../utils/insertionProtector.js'),
      CustomError = require('./errors.js'),
      { Op } = require("sequelize");

module.exports = class Entity{
    constructor(sequelModel) {
        this.sequelModel = sequelModel;
        this.Op = Op;
    };
    insertionProtector = insertionProtector;

    async getOne(searchObj, excludeAttrs = []) {
        return await this.sequelModel.findOne({
            attributes: {exclude: excludeAttrs},
            where: searchObj
        });
    };

    async getOneLike(attribute, likeStr, excludeAttrs = []) {
        return await this.sequelModel.findOne({
            attributes: {exclude: excludeAttrs},
            where: {
                [attribute]: {
                    [Op.like]: likeStr
                    // format: %string to find%
                    // i wonder if it will find the string which starts with or is likeStr itself
                }
            }
        });
    };

    async getPagination(offset = 0, limit = 20,  excludeAttrs = []) {
        return await this.sequelModel.findAll({
            attributes: {exclude: excludeAttrs},
            offset: offset, limit: limit,
            raw: true 
        });
    };

    async delete(searchObj) {
        await this.sequelModel.destroy({
            where: searchObj
        });
    }

    /*
    // Uberi "isRaw" Dibil
    async getAllbyCols(selectObject, excludeAttrs = []) {
        return await this.sequelModel.findAll({
            attributes: {exclude: excludeAttrs},
            where: selectObject
        });
    };
    
    // Uberi "isRaw" Dibil
    async getOnebyCols(selectObject, excludeAttrs = []) {
        const [Users] = await this.sequelModel.findAll({
            attributes: {exclude: excludeAttrs},
            where: selectObject
        });
        return Users;
    };

    */
}
