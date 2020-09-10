'use strict';

let titleInfo = $('#titleInfo');


let claim_input = $('#claim_input');
let hint_input = $('#hint_input');
let rqpAddress_input = $('#rqpAddress_input');
let identifierText = $('#Identifier');



let logger = $('#logger');
//let nowAccount = "";
// let password = `nccutest`;

// 參考 https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
//解譯url中的參數
let url_string = window.location.href;
let url = new URL(url_string);

let nowAccount = url.searchParams.get("nowAccount");
let Auth_address = url.searchParams.get("Auth_address");
let password = url.searchParams.get("password");
let identifier = url.searchParams.get("identifier");
log(`nowAccount：${nowAccount} \nAuth_address:${Auth_address}\nidentifier:${identifier}` );


titleInfo.text(`${clientName} want to access your infomation`);

function log(...inputs) {
    for (let input of inputs) {
        if (typeof input === 'object') {
            input = JSON.stringify(input, null, 2)
        }
        logger.html(input + '\n' + logger.html())
    }
}

//按下policyClaimButton時
policyClaimButton.on('click', function () {
    waitTransactionStatus();

    $.post('/auth/setPolicy', {
        authAddress: Auth_address,
        account: nowAccount,
        password: password,
        identifier:identifier,
        hint:hint_input.val(),
        claim:claim_input.val(),
    }, function (result) {
        if(result.status === true){
            log(result);
            doneTransactionStatus();
        }else{
            log(`setPolicy失敗`);
            log(result);
            doneTransactionStatus();
        }
    });
});


//按下rqpAddressButton時
rqpAddressButton.on('click', function () {
    waitTransactionStatus();

    $.post('/auth/setParticipantOfIdentifier', {
        authAddress: Auth_address,
        account: nowAccount,
        password: password,
        identifier:identifier,
        rqpAddress:rqpAddress_input.val(),
    }, function (result) {
        if(result.status === true){
            log(result);
            doneTransactionStatus();
        }else{
            log(`setPolicy失敗`);
            log(result);
            doneTransactionStatus();
        }
    });
});

refreshPolicyButton.on('click', function () {
    //移除所有表格細項
    $("#policyTable").find("tr:gt(0)").remove();
    $("#rqpTable").find("tr:gt(0)").remove();
    // 查看是否有新的policy或rqp資料存入
    $.post('/db/getPolicy', {
        identifier:identifier,
    }, function (result) {
        if(result.status === true) {
            log(`refreshPolicy成功`);
            let rqpRows = result.rqpInfo;
            let policyRows = result.policyInfo;
            //console.log(result);
            policyRows.forEach(function (row) {
                $('#policyTable tr:last').after(`<tr><th>${row.policy_identifier}</th><th>${row.claim}</th><th>${row.hint}</th></tr>`);
            });
            rqpRows.forEach(function (row) {
                $('#rqpTable tr:last').after(`<tr><th>${row.rqp_address}</th></tr>`);
            });
        }else{
            log(`refreshPolicy失敗`);
            log(result);
        }
    });
});




// 查看是否有新的policy或rqp資料存入
$.post('/db/getPolicy', {
    identifier:identifier,
}, function (result) {
    if(result.status === true) {
        log(`refreshPolicy成功`);
        let rqpRows = result.rqpInfo;
        let policyRows = result.policyInfo;
        //console.log(result);
        policyRows.forEach(function (row) {
            $('#policyTable tr:last').after(`<tr><th>${row.policy_identifier}</th><th>${row.claim}</th><th>${row.hint}</th></tr>`);
        });
        rqpRows.forEach(function (row) {
            $('#rqpTable tr:last').after(`<tr><th>${row.rqp_address}</th></tr>`);
        });
    }else{
        log(`refreshPolicy失敗`);
        log(result);
    }
});

function waitTransactionStatus() {
    $('#accountStatus').html('帳戶狀態：<b style="color: blue">(等待區塊鏈交易驗證中...)</b>')
}

function doneTransactionStatus() {
    $('#accountStatus').text('帳戶狀態：')
}


// mouseover
$(function() {
    policyClaimButton.mouseover(function () {
        policyClaimButton.attr('style', 'background-color: #608de2' );
    });
    policyClaimButton.mouseout(function () {
        policyClaimButton.attr('style', 'background-color: #4364a1' );
    });
});

$(function() {
    rqpAddressButton.mouseover(function () {
        rqpAddressButton.attr('style', 'background-color: #608de2' );
    });
    rqpAddressButton.mouseout(function () {
        rqpAddressButton.attr('style', 'background-color: #4364a1' );
    });
});


$(function() {
    refreshPolicyButton.mouseover(function () {
        refreshPolicyButton.attr('style', 'background-color: #608de2' );
    });
    refreshPolicyButton.mouseout(function () {
        refreshPolicyButton.attr('style', 'background-color: #4364a1' );
    });
});

