const clientRegister = require('../models/IdP_contract/clientRegister');
const deploy = require('../models/IdP_contract/deploy');

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
}