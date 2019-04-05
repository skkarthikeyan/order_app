let vConfig = require('../config/config.json')['DEV'];
import sequelize from 'sequelize';

export class SequelizeService {
    // static vSequelize;
    constructor() {
        // const vConfig = {
        //     "db": {
        //         "dialect": "postgres",
        //         "host": "ec2-107-21-98-144.compute-1.amazonaws.com",
        //         "schema": "public",
        //         "username": "llmdqwxgoslnlb",
        //         "password": "c02e2da3e16cb95ad0f623f046fbaab587e64bd238ed48830d447eb61d42228c",
        //         "name": "d3dfahmim5s8pl",
        //         "port": 5432,
        //         "timezone": "+08:00",
        //         "pool": {
        //             "min": 0,
        //             "max": 5,
        //             "idle": 10000
        //         },
        //         "dialectOptions": {
        //             "ssl": true
        //         }
        //     }
        // }

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