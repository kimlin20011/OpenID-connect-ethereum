const router = require('koa-router')();
const IdP = require('../controllers/IdP_contract');

module.exports = router
    .post(`/deploy`, IdP.deploy)
    .post(`/clientRegister`, IdP.clientRegister)
    .post(`/authenticationRequest`, IdP.authenticationRequest)
    .post(`/token`, IdP.requestToken)
    .post(`/tokenExchange`, IdP.tokenExchange)
