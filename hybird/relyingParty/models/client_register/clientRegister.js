"use strict";
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const fs = require('fs');
const Web3 = require('web3');
//let Client_nosql = require('nosql').load('client.nosql');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('../unlock');
//const getIdPaddress = require('./getIdPaddress.js');

module.exports = async function clientRegister(data) {
    let IdP_Abi = config.IdP.abi;
    let _client_name = data.client_name;
    let _redirect_uri = data.redirect_uri;
    let nowAccount = data.account;
    let password = data.password;
    let IdP_Address = data.IdPAddress;
    //let IdP_Address = await getIdPaddress();
    //console.log(IdP_Address);
    let IdP = new web3.eth.Contract(IdP_Abi,IdP_Address);

    // 解鎖
    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        console.log(`blockchain address not unlock`);
        return;
    }

    //await Client_nosql.clear();

    return new Promise((resolve, reject) => {
        let result ={};
        IdP.methods
            .clientRegister(_client_name,_redirect_uri)
            .send({
                from: nowAccount,
                gas: 3000000
            })
            .on("receipt", function(receipt) {
                result.clientID = receipt.events.clientCreated.returnValues.clientId;
                result.timestamp = receipt.events.clientCreated.returnValues.timestamp;
                result.clientAddress=nowAccount;
                result.IdPAddress = IdP_Address;
                result.status = true;
                //let result_event = JSON.stringify(result);
                fs.writeFileSync('./client.json', JSON.stringify(result));
                //Client_nosql.insert({ clientID: result.clientID,clientAddress:nowAccount,IdPAddress:IdP_Address, timestamp: result.timestamp });
                //送出驗證求取伺服器ip授權層序
                //回傳值*/
                //resolve(receipt.events.participantAdded.returnValues.newParticipant);
                resolve(result);
            })
            .on("error", function(error) {
                result.info =`智能合約clientRegister操作失敗`;
                result.error= error.toString();
                result.status = false;
                console.log(result);
                reject(result);
            });
    });
};
