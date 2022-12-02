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

    async getAll(searchObj, excludeAttrs = []) {
        return await this.sequelModel.findAll({
            attributes: {exclude: excludeAttrs},
            where: searchObj
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
}
