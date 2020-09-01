"use strict";
const fs = require('fs');
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const EthCrypto = require('eth-crypto');
const unlockAccount = require('./unlock');

module.exports = async function introspect_accessToken(data) {
    let Auth_Abi = config.Auth.abi;
    let Auth_Address = fs.readFileSync('./Auth_address.txt').toString();
    let Auth = new web3.eth.Contract(Auth_Abi, Auth_Address);
    let signature = data.signature;
    //parse signature to vrs
    //let signature = JSON.parse(fs.readFileSync('./signedMessage.json', 'utf-8'));
    let vrs = EthCrypto.vrs.fromString(signature.toString());
    // console.log(vrs);


    return new Promise((resolve, reject) => {
        Auth.methods.introspectAccessToken(data.token, vrs.v, vrs.r, vrs.s).call()
            .then((return_result) => {
                console.log(`return_result: ${return_result}`);
                resolve(return_result);
            })
            .catch(function (err) {
                console.log(err);
                reject(err);
            });
    });

};