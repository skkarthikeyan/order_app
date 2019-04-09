import { SequelizeService } from "./sequelize.service";

export class DataAccessService {
    constructor() {
        console.log('Initialize data access service');
    }

    static executeSPWithCallback(pSPName, pParams, pIsJSONFormat, callback) {
        console.log('Executing sp : ' + pSPName);
        try {
            let vParams;
            if (pIsJSONFormat) {
                vParams = '(\'' + JSON.stringify(pParams) + '\')';
            } else {
                if (pParams) {
                    vParams = '(';
                    for (let vParam in pParams) {
                        if (pParams[vParam] !== undefined && pParams[vParam] !== null && typeof pParams[vParam] === 'string' && pParams[vParam].indexOf('\'') !== -1) {
                            pParams[vParam] = this.replaceAll(pParams[vParam], '\'', '\'\'');
                        }
                        vParams += "'" + pParams[vParam] + "',";
                    }
                    vParams = vParams.substring(0, vParams.lastIndexOf(',')) + ');';
                }
                else {
                    vParams = '();';
                }
            }
            let vSQL = 'SELECT ' + pSPName + vParams;
            console.log('vSQL', vSQL);
            SequelizeService.vSequelize.query(vSQL, { type: SequelizeService.vSequelize.QueryTypes.SELECT }).then(function (pResult) {
                let vResult = pResult[0][pSPName.toLowerCase()];
                    callback(vResult);
            }).catch(function (pErr) {
                console.log('Error while executing query : ' + vSQL);
                console.log('Error ' + pErr);
                callback(pErr);

            });
        } catch (pErr) {
            console.log('Error from data access server ' + pErr);
            callback(pErr);
        }
    }

    static replaceAll(pString, pSearch, pReplacement) {
        return pString.replace(new RegExp(pSearch, 'g'), pReplacement);
    }
}