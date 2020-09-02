/**
 * 整合所有子路由
 */

const router = require('koa-router')();

//const blockchain_router = require('./blockchain');
const client_controller = require('../controllers/client');

//router.use('/blockchain', blockchain_router.routes(), blockchain_router.allowedMethods());
//authorizationEndpoint
//router.use('/authorize', authServer.routes(), authServer.allowedMethods());
//tokenEndpoint
//router.use('/token', authServer.routes(), authServer.allowedMethods());

module.exports = router
    .get('/authorize', client_controller.authorize)
    //.post('/token', authServer_controller.requestResource);
