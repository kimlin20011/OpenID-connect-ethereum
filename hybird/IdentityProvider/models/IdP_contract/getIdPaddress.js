"use strict";
let IdPaddressNosql = require('nosql').load('IdPaddress.nosql');

module.exports = async function getIdPaddress() {

    let address = ""
    await IdPaddressNosql.one().make(function(builder) {
        //console.log(builder);
        //builder.first(); //--> updates only the one document
        builder.callback(function(err, response) {
            if(err){
                console.log(err);
                return err;
            }
            console.log(`IdP_Address  = ${response.IdP_Address}`);
            address =  response.IdP_Address;
        });
    });

    return address;
    
    // return web3.eth.personal
    //     .unlockAccount(nowAccount, password, 9999999)
    //     .then(function(result) {
    //      //   console.log(result);
    //         console.log("account已解鎖");
    //         return true;
    //     })
    //     .catch(function(err) {
    //         console.log(err);
    //         console.log("account密碼輸入錯誤");
    //         return false;
    //     });
};
