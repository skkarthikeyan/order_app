import { DataAccessService } from "./../utils/dataaccess.service";
import { EncryptionService } from "./../utils/encryption.service";
let vConfig = require('../config/config.json')['DEV'];

var CryptoJS = require('crypto-js');
require('babel-register');
require('babel-polyfill');
var request = require("request");

let deliverOrder = orderId => {
    let manageParams = {
        order_id: orderId,
        state: 'delivered'
    }
    setTimeout(async () => {
        await DataAccessService.executeSP('sp_manage_order', manageParams, true);
        console.log('Order delivered successfully!');
    }, 60000);
}


export const createOrder = async (req, res) => {
    try {
        let manageParams = {};
        let params = req.body;
        let result = {};
        console.log('params', params);
        let queryResponse = await DataAccessService.executeSP('sp_create_order', params, true);
        if (queryResponse.status === 0) {
            callPayment(params.orderdetails, queryResponse.order_id, async paymentResponse => {
                console.log('PaymentResponse', paymentResponse);
                manageParams = {
                    order_id: paymentResponse.order_id,
                    state: paymentResponse.status
                }
                await DataAccessService.executeSP('sp_manage_order', manageParams, true);
                if (paymentResponse.status_code == 0) {
                    deliverOrder(paymentResponse.order_id);
                }
                result = {
                    status: 0,
                    result: `Order: ${paymentResponse.order_id} created successfully and Payment status is ${paymentResponse.status} `
                }
                res.send(result);
            });
        }
        else {
            res.status(500).send("Error: " + JSON.stringify(queryResponse));
        }
    }
    catch (err) {
        console.log('error', err);
    }
}

let callPayment = (orderDetails, orderId, callback) => {
    let result = {};
    const encPaymentReq = EncryptionService.getEncrypted(JSON.stringify(orderDetails));
    const encryptedWord = CryptoJS.enc.Utf8.parse(encPaymentReq);
    const encrypted = CryptoJS.enc.Base64.stringify(encryptedWord);

    let options = {
        url: vConfig.payment.url + encrypted,
        headers: { "Content-Type": "application/json" },
        json: true
    };
    console.log('options', options);
    request(options, (error, response) => {
        if (response) {
            result = response.body;
            result.order_id = orderId;
            callback(result);
        }
    });


}

export const cancelOrder = async (req, res) => {
    try {
        let orderid = req.params.orderid;
        if (orderid == null || orderid == undefined) {
            res.status(400).send("Invalid Parameter");
        }
        else {
            let manageParams = {
                order_id: orderid,
                state: 'cancelled'
            }
            let queryResponse = await DataAccessService.executeSP('sp_manage_order', manageParams, true);
            if (queryResponse.status === 0) {
                let result =
                {
                    status: 0,
                    result: queryResponse.result + ' It\'s current state is "' + queryResponse.current_order_state + '".'
                }
                res.send(result);
            }
            else {
                res.status(500).send("Error: " + JSON.stringify(queryResponse));
            }
        }

    }
    catch (err) {
        console.log('error', err);
    }
}

export const getOrderStatus = async (req, res) => {
    try {
        let orderid = req.params.orderid;
        let result = {};
        if (orderid == null || orderid == undefined) {
            res.status(400).send("Invalid Parameter");
        }
        else {
            let queryResponse = await DataAccessService.executeSP('sp_order_status', { orderid });
            if (queryResponse.status === 0) {
                result = {
                    status: 0,
                    result: queryResponse.result
                }
                res.send(result);
            }
            else {
                res.status(500).send("Error: " + JSON.stringify(queryResponse));
            }
        }
    }
    catch (err) {
        console.log('error', err);
    }
}