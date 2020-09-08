const clientRegister = require('../models/client_register/clientRegister');
const authorize = require('../models/authorize');

module.exports = {
    async authorize(ctx) {
        //let formData = ctx.request.body;
        //var queryData = ctx.query;  //ctx.headers為標頭
        let res = {}; 
        try{
            let authorize_result = await authorize();
            res = authorize_result;
            console.log(`authorize 111`)
            //ctx.body = res;
            ctx.status = 308;
            ctx.body = res;
            ctx.redirect('http://localhost:3004/authorize');
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
    }
}