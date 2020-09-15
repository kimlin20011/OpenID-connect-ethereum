'use strict';

let titleInfo = $('#titleInfo');
let whoami = $('#whoami');
let whoamiButton = $('#whoamiButton');

let logger = $('#logger');
let nowAccount = "";
// let password = `nccutest`;

// 參考 https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
//解譯url中的參數
let url_string = window.location.href;
let url = new URL(url_string);

// let nowAccount = url.searchParams.get("nowAccount");
// let Auth_address = url.searchParams.get("Auth_address");
// let password = url.searchParams.get("password");
// let identifier = url.searchParams.get("identifier");
//log(`nowAccount：${nowAccount}` );


//titleInfo.text(`${clientName} want to access your infomation`);
titleInfo.text(`A want to access your infomation`);

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
$.get('/getAccounts', function (accounts) {
    for (let account of accounts) {
        whoami.append(`<option value="${account}">${account}</option>`)
    }
    nowAccount = whoami.val();
    log(nowAccount, '目前選擇的以太帳戶')
});

// mouseover
$(function() {
    whoamiButton.mouseover(function () {
        whoamiButton.attr('style', 'background-color: #608de2' );
    });
    whoamiButton.mouseout(function () {
        whoamiButton.attr('style', 'background-color: #4364a1' );
    });
});