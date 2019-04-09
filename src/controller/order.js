import { DataAccessService } from "./../utils/dataaccess.service";

export let createOrder = (req, res) => {
    try {
        let params = req.body;
        console.log('params', params);
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

let callPayment = ()=>{
    //  call payment app
}

export let cancelOrder = (req, res) => {
    try {
        let orderid = req.params.orderid;
        if (orderid == null || orderid == undefined) {
            res.status(400).send("Invalid Parameter");
        }
        else{
            DataAccessService.executeSPWithCallback('sp_cancel_order', orderid, false, (queryResponse) => {
                if (queryResponse.status === 0) {
                    let result = queryResponse.result+ ' It\'s current state is "'+queryResponse.current_order_state+'".';
                    res.send(result);
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
            DataAccessService.executeSPWithCallback('sp_order_status', orderid, false, (queryResponse) => {
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