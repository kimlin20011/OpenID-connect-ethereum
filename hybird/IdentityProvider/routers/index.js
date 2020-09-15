/**
 * 整合所有子路由
 */

const router = require('koa-router')();

const blockchain_router = require('./blockchain');
const authServer_controller = require('../controllers/authServer');

router.use('/blockchain', blockchain_router.routes(), blockchain_router.allowedMethods());
//authorizationEndpoint
//router.use('/authorize', authServer.routes(), authServer.allowedMethods());
//tokenEndpoint
//router.use('/token', authServer.routes(), authServer.allowedMethods());

module.exports = router
    .get('/authorize', authServer_controller.authorize)
    .get(`/getAccounts`,authServer_controller.getAccounts)
    //.post('/token', authServer_controller.requestResource);
