import { SequelizeService } from "./sequelize.service";

export class DataAccessService {
    constructor() {
        console.log('Initialize data access service');
    }

    static executeSP(pSPName, pParams, pIsJSONFormat) {
        return new Promise(function (pResolve, pReject) {
            try {
                let vParams;
                if (pIsJSONFormat) {
                    vParams = '(\'' + JSON.stringify(pParams) + '\')';
                }
                else {
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
                SequelizeService.vSequelize.query(vSQL, { type: SequelizeService.vSequelize.QueryTypes.SELECT }).then(function (pResult) {
                    let vResult = pResult[0][pSPName.toLowerCase()];
                    if (vResult.status === 0) {
                        pResolve(vResult);
                    }
                    else {
                        console.log('error');
                    }
                }).catch(function (pErr) {
                    console.log('error', pErr);
                });
            }
            catch (pErr) {
                console.log('error', pErr);
            }
        });
    }

    static replaceAll(pString, pSearch, pReplacement) {
        return pString.replace(new RegExp(pSearch, 'g'), pReplacement);
    }
}