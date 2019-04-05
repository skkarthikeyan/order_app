import express from 'express';
import * as orderController from './controller/order'

const app = express();

app.get('/', (req, res)=>{
    res.send('app started!');
});

app.post('api/order/createorder', orderController.createOrder);
app.post('api/order/cancelorder', orderController.cancelOrder)
app.get('api/order/getorderstatus/:orderid?', orderController.getOrderStatus);

app.listen(3000, ()=>{
    console.log('Order App listening on port 3000!')
})