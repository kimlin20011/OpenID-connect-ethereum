const introspectToken = require('../models/IdP_contract/introspectToken');

module.exports = {
    async requestUserInfo(ctx) {
        //let formDataBody = ctx.request.body;
        let formData = ctx.query;
        let user = formDataBody.user;
        let accessToken = ctx.headers.token;;
        let signature = ctx.headers.signature;
        let res = {}; 

        if (!__.contains(formData.scope, 'openid')) {
            ctx.status = 403;
            res.error = `not supported scope`
            ctx.body = res;
            return;
        }

        if (!user) {
            ctx.status = 404;
            res.error = `undefined user`
            ctx.body = res;
            return;
        }

        if (!accessToken || !signature) {
            ctx.status = 401;
            res.error = `invalid_token`;
            res.error_description = `no token or signture include`;
            ctx.body = res;
            return;
        }

        try{
            let introspectToken_result = await introspectToken(formDataBody,formDataQuery);
            res = introspectToken_result;
            ctx.body = res;
        } catch(error) {
            ctx.body = error;
        }
    },
}