'use strict';

let whoami = $('#whoami');
let whoamiButton = $('#whoamiButton');

let RM_contract_address_button = $('#RM_contract_address_button');
let deploy_RM_contract_button = $('#deploy_RM_contract_button');
let Authorization_contract_address_button = $('#Authorization_contract_address_button');
let deploy_Authorization_contract_button = $('#deploy_Authorization_contract_button');
let changeToRMButton = $('#changeToRMButton');

let RM_contract_address = $('#RM_contract_address');
let Authorization_contract_address = $('#Authorization_contract_address');
let RM_contract_address_of_Authorization = $('#RM_contract_address_of_Authorization');


let logger = $('#logger');
let nowAccount = "";

let password = `nccutest`;
// used mapping
//let IoTLoginedMap = new Map();
let RM_address = "";
let Auth_address = "";

//let addressPasswordMap = new Map();

function log(...inputs) {
    for (let input of inputs) {
        if (typeof input === 'object') {
            input = JSON.stringify(input, null, 2)
        }
        logger.html(input + '\n' + logger.html())
    }
}

// 當按下登入按鍵時
whoamiButton.on('click', async function () {
    nowAccount = whoami.val();
    log(nowAccount, '目前選擇的以太帳戶')
});

// 載入使用者至 select tag
$.get('/blockchain/accounts', function (accounts) {
    for (let account of accounts) {
        whoami.append(`<option value="${account}">${account}</option>`)
    }
    nowAccount = whoami.val();
    log(nowAccount, '目前選擇的以太帳戶')
});

//按下deploy_RM_contract_button時
deploy_RM_contract_button.on('click', function () {
    waitTransactionStatus();

    $.post('/blockchain/deploy_RM', {
        //address: B_OAuthAddress,
        account: nowAccount,
        password: password,
    }, function (result) {
/*        log({
            result : result,
        });*/
        if(result.status === true){
            log(`RM 部署成功，合約位址：${result.address}`);
            RM_address = result.address;
            $('#rm_address').html(`RM address:<b style="color: mediumblue">${RM_address}</b>`);
            doneTransactionStatus();
        }else{
            log(`RM 部署失敗`);
            $('#rm_address').html(`RM address:<b style="color: mediumblue">${RM_address}</b>`);
            doneTransactionStatus();
        }
    });
});


//按下RM_contract_address_button時
RM_contract_address_button.on('click', function () {
    RM_address = RM_contract_address.val();
    log(`RM 新增成功，合約位址：${RM_address}`);
    $('#rm_address').html(`RM address:<b style="color: mediumblue">${RM_address}</b>`);
});


//按下RM_contract_address_button時
Authorization_contract_address_button.on('click', function () {
    Auth_address = Authorization_contract_address.val();
    log(`Auth 新增成功，合約位址：${Auth_address}`);
    $('#auth_address').html(`Auth address:<b style="color: mediumblue">${Auth_address}</b>`);
});


//按下deploy_Authorization_contract_button時
deploy_Authorization_contract_button.on('click', function () {
    waitTransactionStatus();

    $.post('/blockchain/deploy_Auth', {
        account: nowAccount,
        RM_Address:RM_contract_address_of_Authorization.val(),
        password: password,
    }, function (result) {
        if(result.status === true){
            log(`Auth合約 部署成功，合約位址：${result.address}`);
            Auth_address = result.address;
            $('#auth_address').html(`Auth address:<b style="color: mediumblue">${Auth_address}</b>`);
            doneTransactionStatus();
        }else{
            log(`Auth合約部署失敗`);
            log(result);
            $('#auth_address').html(`Auth address:<b style="color: mediumblue">${Auth_address}</b>`);
            doneTransactionStatus();
        }
    });
});
/*
function islogined() {
    if (IoTLoginedMap.get(nowAccount) === `succeeded`){
        $('#isGranted').html(`1. 登入狀態: ${nowAccount}<b style="color: green"><br>您已登入，可開始操作device</b>`);
        $('#loginStatus').html(`登入狀態: ${nowAccount}<b style="color: mediumblue"><br>登入成功 </b>`);
    }else{
        $('#isGranted').html(`1. 登入狀態: ${nowAccount}<b style="color: red"><br>您尚未登入，請先從上方登入</b>`);
        $('#loginStatus').html(`登入狀態: ${nowAccount}<b style="color: red"><br>尚未登入 </b>`);
    }
}
*/

function waitTransactionStatus() {
    $('#accountStatus').html('帳戶狀態：<b style="color: blue">(等待區塊鏈交易驗證中...)</b>')
}

function doneTransactionStatus() {
    $('#accountStatus').text('帳戶狀態：')
}


// mouseover
$(function() {
    whoamiButton.mouseover(function () {
        whoamiButton.attr('style', 'background-color: #608de2' );
    });
    whoamiButton.mouseout(function () {
        whoamiButton.attr('style', 'background-color: #4364a1' );
    });
});

$(function() {
    deploy_RM_contract_button.mouseover(function () {
        deploy_RM_contract_button.attr('style', 'background-color: #608de2' );
    });
    deploy_RM_contract_button.mouseout(function () {
        deploy_RM_contract_button.attr('style', 'background-color: #4364a1' );
    });
});

$(function() {
    deploy_Authorization_contract_button.mouseover(function () {
        deploy_Authorization_contract_button.attr('style', 'background-color: #608de2' );
    });
    deploy_Authorization_contract_button.mouseout(function () {
        deploy_Authorization_contract_button.attr('style', 'background-color: #4364a1' );
    });
});


$(function() {
    Authorization_contract_address_button.mouseover(function () {
        Authorization_contract_address_button.attr('style', 'background-color: #608de2' );
    });
    Authorization_contract_address_button.mouseout(function () {
        Authorization_contract_address_button.attr('style', 'background-color: #4364a1' );
    });
});

$(function() {
    RM_contract_address_button.mouseover(function () {
        RM_contract_address_button.attr('style', 'background-color: #608de2' );
    });
    RM_contract_address_button.mouseout(function () {
        RM_contract_address_button.attr('style', 'background-color: #4364a1' );
    });
});


$(function() {
    changeToRMButton.mouseover(function () {
        changeToRMButton.attr('style', 'background-color: #608de2' );
    });
    changeToRMButton.mouseout(function () {
        changeToRMButton.attr('style', 'background-color: #4364a1' );
    });
});



