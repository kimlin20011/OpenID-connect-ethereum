"use strict";
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
//let Client_nosql = require('nosql').load('client.nosql');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('./unlock');

module.exports = async function requestToken(data) {
    let _code = data.code;
    let nowAccount = data.account;
    let password = data.password;
    let IdP_Address= data.IdPAddress;
    let IdP_Abi = config.IdP.abi;
    let IdP = new web3.eth.Contract(IdP_Abi,IdP_Address);

    // 解鎖
    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        console.log(`blockchain address not unlock`);
        return;
    }

    return new Promise((resolve, reject) => {
        let result ={};
        IdP.methods
            .requestToken(_code)
            .send({
                from: nowAccount,
                gas: 3000000
            })
            .on("receipt", function(receipt) {
                console.log(receipt);
                result.tokenRelease = receipt.events.tokenRelease.returnValues;
                result.status = true;
                //送出驗證求取伺服器ip授權層序
                //回傳值*/
                //resolve(receipt.events.participantAdded.returnValues.newParticipant);
                resolve(result);
            })
            .on("error", function(error) {
                result.info =`智能合約requestToken操作失敗`;
                result.error= error.toString();
                result.status = false;
                console.log(result);
                reject(result);
            });
    });
};
