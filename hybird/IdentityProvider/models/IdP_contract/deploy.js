"use strict";
//const fs = require('fs');
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
var nosql = require('nosql').load('database.nosql');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('./unlock');


module.exports = async function deploy_IdP_contract(){
    let IdP_Bytecode = config.IdP.bytecode;
    let IdP_Abi = config.IdP.abi;
//取得目前geth中第一個account
    let nowAccount ="";
    //先用第一組帳號，要用那組之後可以討論
    await web3.eth.getAccounts((err, res) => {nowAccount = res[0]} );

    let password = config.geth.password;
    let IdP = new web3.eth.Contract(IdP_Abi);
    // 解鎖
    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        console.log(`not unlock`);
        return;
    }

    // clear the database
    await nosql.clear();

    return new Promise((resolve, reject) => {
        let result ={};
        IdP
            .deploy({
                data: IdP_Bytecode
            })
            .send({
                from: nowAccount,
                gas: 6000000
            })
            .on('error', function(error){
                result.info = error;
                result.status = false;
                reject(result);
            })
            .on("receipt", function(receipt) {
                console.log(receipt);
                // 更新合約介面
                result.status = true;
                result.address = receipt.contractAddress;
                nosql.insert({ IdP_Address: receipt.contractAddress});
                resolve(result);
                // //將新生成的RM地址寫進.txt檔案
                // fs.writeFileSync('./RM_address.txt', RM_Address);
                // let sql = `INSERT INTO contract SET ?`
                // db.query(sql, metaData , function (err, rows) {
                //     if (err) {
                //         //console.log(err);
                //         result.dbInfo = "資料庫更新失敗。";
                //         result.err = err;
                //         //console.log(result);
                //         reject(result);
                //     }
                //     result.dbInfo = "資料庫contract更新成功。";
                //     resolve(result);
                // });
            })
    });

};

