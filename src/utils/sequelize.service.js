let vConfig = require('../config/config.json')['PROD'];
import sequelize from 'sequelize';

export class SequelizeService {
    
    constructor() {
        this.vSequelize;
        try {
            console.log("initialize sequelize service");
            SequelizeService.vSequelize = new sequelize(
                vConfig.db.name,
                vConfig.db.username,
                vConfig.db.password,
                {
                    dialect: vConfig.db.dialect,
                    host: vConfig.db.host,
                    port: vConfig.db.port,
                    timezone: vConfig.db.timezone,
                    dialectOptions: vConfig.db.dialectOptions,
                });
        } catch (pErr) {
            console.log('Error while establishing database connection with sequelize : ' + pErr);
            throw 401;
        }
    }
}