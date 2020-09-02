const authorize = require('../models/authorize');

module.exports = {
    async authorize(ctx) {
        //let formData = ctx.request.body;
        var queryData = ctx.query;  //ctx.headers為標頭
        let res = {}; 
        try{
            let authorize_result = await authorize(queryData);
            res = authorize_result;
            //ctx.body = res;
            ctx.status = 308;
            ctx.body = res;
            ctx.redirect('http://localhost:3004/authorize');
        } catch(error) {
            ctx.body = error;
        }
    },
}