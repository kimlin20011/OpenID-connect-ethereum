 "use strict";
const config = require('../configs/config');
const fs = require('fs');
const randomstring = require("randomstring");

module.exports = async function authorize() {
    //let clienID = null;
    let redirect_uri = config.client.redirect_uris[0];
    let scope = config.client.scope;
    let response_type = 'code id_token'; 
    let client = fs.readFileSync('client.json');
    let clientObj = JSON.parse(client);
    let clientID = clientObj.clientID

    return new Promise((resolve, reject) => {
        let result ={};
        if (!clientID){
            result.error = `No client ID was found.`
            reject(result);
        }else {
            result.state = randomstring.generate();
            result.clientID = clientID;
            result.redirect_uri = redirect_uri;
            result.scope = scope; 
            result.IdPAddress = clientObj.IdPAddress; 
            result.response_type = response_type;
            console.log(`client info recieved`);
            resolve(result);
        }
    });
};
