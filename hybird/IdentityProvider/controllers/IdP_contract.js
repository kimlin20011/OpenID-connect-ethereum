const clientRegister = require('../models/IdP_contract/clientRegister');
const deploy = require('../models/IdP_contract/deploy');
const authenticationRequest = require('../models/IdP_contract/authenticationRequest');
const requestToken = require('../models/IdP_contract/requestToken');

module.exports = {
    async deploy(ctx) {
        let formData = ctx.request.body;
        let res = {}; 
        try{
            let deploy_result = await deploy(formData);
            res = deploy_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async clientRegister(ctx) {
        let formData = ctx.request.body;
        let res = {}; 
        try{
            let clientRegister_result = await clientRegister(formData);
            res = clientRegister_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
    async authenticationRequest(ctx) {
        let formData = ctx.request.body;
        let res = {}; 
        try{
            let authenticationRequest_result = await authenticationRequest(formData);
            //res = authenticationRequest_result;
            ctx.body = authenticationRequest_result;
        } catch(error) {
            ctx.body = error;
        }
    },
    async requestToken(ctx) {
        let formData = ctx.request.body;
        //let res = {}; 
        try{
            let requestToken_result = await requestToken(formData);
            ctx.body = requestToken_result;
        } catch(error) {
            ctx.body = error;
        }
    },
}