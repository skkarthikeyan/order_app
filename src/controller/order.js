import { DataAccessService } from "./../utils/dataaccess.service";

export let createOrder = (req, res) => {
    try {
        let params = req.body;
        DataAccessService.executeSPWithCallback('sp_create_order', params, true, (queryResponse) => {
            if (queryResponse.status === 0) {
                res.send(queryResponse.result);
            }
            else {
                res.status(500).send("Error: " + JSON.stringify(queryResponse));
            }
        });
    }
    catch (err) {
        console.log('error', err);
    }
}

export let cancelOrder = (req, res) => {
    try {
        let orderid = req.params.orderid;
        if (orderid == null || orderid == undefined) {
            res.status(400).send("Invalid Parameter");
        }
        else{
            let params = {
                "order_id": orderid
            }
            DataAccessService.executeSPWithCallback('sp_cancel_order', params, true, (queryResponse) => {
                if (queryResponse.status === 0) {
                    res.send(queryResponse.result);
                }
                else {
                    res.status(500).send("Error: " + JSON.stringify(queryResponse));
                }
            });
        }
        
    }
    catch (err) {
        console.log('error', err);
    }
}

export let getOrderStatus = (req, res) => {
    try {
        let orderid = req.params.orderid;
        if (orderid == null || orderid == undefined) {
            res.status(400).send("Invalid Parameter");
        }
        else {
            let params = {
                "order_id": orderid
            }
            DataAccessService.executeSPWithCallback('sp_order_status', params, true, (queryResponse) => {
                if (queryResponse.status === 0) {
                    res.send(queryResponse.result);
                }
                else {
                    res.status(500).send("Error: " + JSON.stringify(queryResponse));
                }
            });
        }
    }
    catch (err) {
        console.log('error', err);
    }
}