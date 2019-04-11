import express from 'express';
import * as orderController from './controller/order'

const app = express();

require("babel-polyfill");
var sequelize_service = require("./utils/sequelize.service");
var seq = new sequelize_service.SequelizeService();

const port = process.env.PORT || 3001;

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get('/', (req, res)=>{
    res.send('app started!');
});

app.post('/api/order/createorder', orderController.createOrder);
app.get('/api/order/cancelorder/:orderid?', orderController.cancelOrder)
app.get('/api/order/getorderstatus/:orderid?', orderController.getOrderStatus);

app.listen(port, ()=>{
    console.log(`Order App listening on port: ${ port }!`)
})