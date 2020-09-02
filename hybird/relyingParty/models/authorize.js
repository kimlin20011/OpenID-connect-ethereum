 "use strict";
const config = require('../../configs/config');
let Client_nosql = require('nosql').load('client.nosql');
let state = null;
let client = {
	"redirect_uris": ["http://localhost:9000/callback"],
	"scope": "openid_profile_email_phone_address"
};

module.exports = async function authorize(data) {
    let clienID = null;
    let redirect_uri = client.redirect_uris[0];
    let scope = client.scope;
    await Client_nosql.one(function(client) {
		if (!client.clienID) {
			return client.clienID;	
		}
	}, function(err, clienID) {
		if (clienID) {
			console.log("client_ID: %s", clienID);
		} else {
			console.log('No client_ID was found.');
		}
		clienID = clienID;
		return;
	});

    return new Promise((resolve, reject) => {
        let result ={};
        if (!clienID){
            reject(`No client_ID was found.`);
        }else {
            state = randomstring.generate();
            result.clienID = clienID;
            result.redirect_uri = redirect_uri;
            result.scope = scope;
            result.state = state;  
            resolve(result);
        }
    });
};
