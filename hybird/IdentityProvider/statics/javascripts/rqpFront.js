'use strict';
let whoami = $('#whoami');
let whoamiButton = $('#whoamiButton');
let selectResourceName = $('#selectResourceName');
let selectNamButton = $('#selectNamButton');
let requestResourceButton = $('#requestResourceButton');




let logger = $('#logger');
//let nowAccount = "";
let password = `nccutest`;
let authInfo = {};
let authFag = false;

// 參考 https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
//解譯url中的參數
let url_string = window.location.href;
let url = new URL(url_string);

let nowAccount = null;
/*let Auth_address = url.searchParams.get("Auth_address");
let password = url.searchParams.get("password");
let identifier = url.searchParams.get("identifier");
log(`nowAccount：${nowAccount} \nAuth_address:${Auth_address}\nidentifier:${identifier}` );*/

let nowName = null;

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
    log(nowAccount, 'Choosed Ethereum account')
});

// 載入使用者至 select tag
$.get('/blockchain/accounts', function (accounts) {
    for (let account of accounts) {
        whoami.append(`<option value="${account}">${account}</option>`)
    }
    nowAccount = whoami.val();
    log(nowAccount, 'Choosed Ethereum account')
});


// 載入使用者至 select tag
$.get('/db/getResourceName', function (results) {
    for (let info of results.info) {
        selectResourceName.append(`<option value="${info.name}">${info.name}</option>`)
    }
    nowName = selectResourceName.val();
    log(nowName, 'Choosed resource')
});


// 當按下登入按鍵時
selectNamButton.on('click', async function () {
    nowName = selectResourceName.val();
    log(nowName, 'Choosed resource')
});


requestResourceButton.on('click', function () {
    //waitTransactionStatus();
    let res = {};
    if (nowAccount != null && nowName != null && authFag == false) {
        waitTransactionStatus();
        $.get('/offchain/requestResource', {
            rqpAddress: nowAccount,
            name: nowName,
        }, function (result) {
            if (result.status === true) {
                res.hint = result.body.claim_hint;
                res.ticket = result.body.ticket;
                res.authAddress = result.body.authAddress;
                res.pass = true;
                log(`request permission ticket succeed`);
                //log(result);
                try {
                    setClaim(res);
                } catch (error) {
                    log(error);
                    doneTransactionStatus();
                }
            } else {
                log(`request permission ticket failed`);
                res.pass = false;
                log(result);
                alert(`request permission ticket failed`);
                doneTransactionStatus();
            }
        });
    } else if (nowAccount != null && nowName != null && authFag == true) {
        //alert(`request protected resource by access token`)
        encryptToken(authInfo);
    } else {
        res.pass = false;
        log(`nowAccount:${nowAccount} \n nowName:${nowName} \n must be set`)
    }
});


function setClaim(res) {
    if (res.pass === true) {
        let claimEntered = prompt(`Please enter your claim to get authorization \n hint: ${res.hint}`, `hint`);
        log(`claim:${claimEntered}`);
        $.post('/auth/requestAccessToken', {
            ticket: res.ticket,
            claim: claimEntered,
            account: nowAccount,
            password: password,
            authAddress: res.authAddress,
        }, function (result) {
            if (result.status === true) {
                log(`request access token succeed`);
                //alert(`request access token succeed`);
                console.log(result);
                $('#isAuth').html('<p style="color: blue">Already authorzied</p>');
                //encryptToken (result);
                authFag = true;
                authInfo = result;
                doneTransactionStatus();
            } else {
                log(`request access token failed`);
                log(result);
                doneTransactionStatus();
            }
        });
    } else {
        log(`request resource failed`);
    }

}

//request party 將token簽名
function encryptToken(res) {
    $.post('/rqp/encryptToken', {
        token: res.access_token,
        account: nowAccount,
        password: password,
    }, function (result) {
        if (result.status === true) {
            result.token = res.access_token;
            log(`sign succeed`);
            log(`signature${result.signature}`);
            requestByToken(result);
        } else {
            log(`sign failed`);
            log(result);
            doneTransactionStatus();
        }
    });
}


function requestByToken(data) {
    let formData = {};
    formData.rqpAddress = nowAccount;
    formData.name = nowName;
    $.ajax({
        url: "/offchain/requestResource",
        type: 'GET',
        data: formData,
        // Fetch the stored token from localStorage and set in the header
        headers: {
            "authorization": data.signature,
            "token": data.token,
        },
        error: function (err) {
            console.log('Error!', err);
            //doneTransactionStatus();
        },
        success: function (data) {
            log('Success!');
            log('signature', data);
            //if (data.isSignedAccountValid === true) {
            if (data === true) {
                let tem = 25+Math.floor(Math.random()*5);
                let hum = 50+Math.floor(Math.random()*5);
                $('#isSignedAccountValid').html('<b style="color: blue">UMA Blockchain Authorization Status：TRUE</b>');
                $('#tem').text(`Temperature: ${tem}`);
                $('#hum').text(`Humidity: ${hum}`);
            } else {
                log(`token invaild`);
                $('#isAuth').html('<p style="color: red">You have not been authorized.</p>');
                authFag = false;
                alert(`token invaild`);
            }
            //doneTransactionStatus();
        }
    });
}

function convertUNIX_time(unixTime) {
    let dt = new Date(unixTime * 1000);
    let hr = dt.getHours();
    let m = "0" + dt.getMinutes();
    let s = "0" + dt.getSeconds();
    return dt + ':' + hr + ':' + m.substr(-2) + ':' + s.substr(-2);
}

// mouseover
$(function () {
    requestResourceButton.mouseover(function () {
        requestResourceButton.attr('style', 'background-color: #608de2');
    });
    requestResourceButton.mouseout(function () {
        requestResourceButton.attr('style', 'background-color: #4364a1');
    });
});

$(function () {
    whoamiButton.mouseover(function () {
        whoamiButton.attr('style', 'background-color: #608de2');
    });
    whoamiButton.mouseout(function () {
        whoamiButton.attr('style', 'background-color: #4364a1');
    });
});


$(function () {
    selectNamButton.mouseover(function () {
        selectNamButton.attr('style', 'background-color: #608de2');
    });
    selectNamButton.mouseout(function () {
        selectNamButton.attr('style', 'background-color: #4364a1');
    });
});


function waitTransactionStatus() {
    $('#accountStatus').html('Account status：<b style="color: blue">(Mining processing...)</b>')
}

function doneTransactionStatus() {
    $('#accountStatus').text('Account status：')
}