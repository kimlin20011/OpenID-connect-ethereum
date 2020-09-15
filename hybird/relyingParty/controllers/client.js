const clientRegister = require('../models/client_register/clientRegister');
const authorize = require('../models/authorize');
//const cors = 'https://cors-anywhere.herokuapp.com/'; // use cors-anywhere to fetch api data
//const redirect_url = 'http://localhost:3004/authorize'; // origin api url
const url = require("url");

const authServer = {
	authorizationEndpoint: 'http://localhost:3004/authorize',
	tokenEndpoint: 'http://localhost:3004/token',
	userInfoEndpoint: 'http://localhost:3005/userinfo'
};

// var buildUrl = function(base, options, hash) {
// 	let newUrl = url.parse(base, true);
// 	delete newUrl.search;
// 	if (!newUrl.query) {
// 		newUrl.query = {};
// 	}
// 	__.each(options, function(value, key, list) {
// 		newUrl.query[key] = value;
// 	});
// 	if (hash) {
// 		newUrl.hash = hash;
// 	}
	
// 	return url.format(newUrl);
// };

module.exports = {
    async authorize(ctx) {
        //let formData = ctx.request.body;
        //var queryData = ctx.query;  //ctx.headers為標頭
        let res = {}; 
        try{
            let authorize_result = await authorize();
            res = authorize_result;
            //console.log(`authorize 111`)
            //let authorizeUrl = await buildUrl(authServer.authorizationEndpoint, authorize_result);
            //ctx.body = res;
            ctx.status = 302;
            //ctx.body = res;
            //ctx.redirect('http://localhost:3004/authorize');
            //console.log(`${authServer.authorizationEndpoint}`)
            ctx.res.setHeader('Access-Control-Allow-Origin', '*')
            ctx.redirect(`${authServer.authorizationEndpoint}?state=${res.state}&clientID=${res.state}&redirect_uri=${res.redirect_uri}&scope=${res.scope}&IdPAddress=${res.IdPAddress}&response_type=${res.response_type}`);
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