let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../app');
chai.use(chaiHttp);
describe('/POST /api/order/createorder', () => {
    it('it should insert order details to db', (done) => {
        let params = {
            "orderdetails":
                [{
                    "user_name": "karthikeyan",
                    "user_id": "123456345",
                    "user_email": "test@test.com",
                    "order_quantity": "7",
                    "merchant_code":"fuyf7876357edi8578ty7i7g",
                    "merchant_key":"7682tgdgyu3y"
                }]
        }
        chai.request(server)
            .post('/api/order/createorder')
            .send(params)
            .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.status.should.be.eql(0);
            done();
        });
    });
});

describe('/GET /api/order/cancelorder/:orderid', () => {
    it('it should change the order state to cancel', (done) => {
        let orderID = 30;
        chai.request(server)
            .get('/api/order/cancelorder/'+orderID)
            .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status');
            res.body.status.should.be.eql(0);
            done();
        });
    });
});
describe('/GET /api/order/getorderstatus/:orderid', () => {
    it('it should GET order details', (done) => {
        let orderID = 30;
        chai.request(server)
            .get('/api/order/getorderstatus/'+ orderID)
            .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            done();
        });
    });
});