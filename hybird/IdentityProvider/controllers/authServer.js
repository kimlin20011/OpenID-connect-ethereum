const authorize = require('../models/authzServer/authorize');

module.exports = {
    async authorize(ctx) {
        //let formData = ctx.request.body;
        var queryData = ctx.query;  //ctx.headers為標頭
        let res = {}; 
        try{
            let authorize_result = await authorize(queryData);
            res = authorize_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
}