const authorize = require('../models/authzServer/authorize');
const getAccounts = require('../models/authzServer/getAccounts');


module.exports = {
    async getAccounts(ctx) {
        let res = {}; 
        try{
            let accounts = await getAccounts();
            ctx.body = accounts;
        } catch(error) {
            ctx.body = error;
        }
    },
    async authorize(ctx) {
        //let formData = ctx.request.body;
        //var queryData = ctx.query;  //ctx.headers為標頭
        let res = {}; 
        try{
           // let authorize_result = await authorize(queryData);
            console.log(`authorize_re`);
            res_1 = `authorize_re`;
            res.res_1 = res_1;
            //ctx.body = render('approveUser',res); 
            //ctx.res.setHeader('Access-Control-Allow-Origin', '*')
            await ctx.render('approveUser', {client: `res`});
            return;
            //return;
            //ctx.body = res;
            //ctx.redirect('/approveUser.html');
        } catch(error) {
            ctx.body = error;
        }
    },
}