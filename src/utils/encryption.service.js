var CryptoJS = require('crypto-js');
var config = require('../config/config.json')['PROD'];
export class EncryptionService {
    constructor() {
    }
    static getEncrypted(pWords) {
        return CryptoJS.AES.encrypt(pWords, config.encryption_key).toString();
    }
    static getDecrypted(pWords) {
        return CryptoJS.AES.decrypt(pWords, config.encryption_key).toString(CryptoJS.enc.Utf8);
    }
}
