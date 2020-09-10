'use strict';

let blockchainLoginButton = $('#blockchainLoginButton');
let blockchainLoginProcessStatus = $('#blockchainLoginProcessStatus');
let blockchainLoginStatus = $('#blockchainLoginStatus');

let userInfoButton = $('#userInfoButton');
let userInfoData = $('#userInfoData');

let logger = $('#logger');


function log(...inputs) {
    for (let input of inputs) {
        if (typeof input === 'object') {
            input = JSON.stringify(input, null, 2)
        }
        logger.html(input + '\n' + logger.html())
    }
}

//按下blockchainLoginButton時
blockchainLoginButton.on('click', function () {
    waitTransactionStatus();

    $.get('/authorize', {
        //address: B_OAuthAddress,
    }, function (result) {
/*        log({
            result : result,
        });*/
        if(result.status === true){
            log(`blockchain login success`);
            log(result);
            blockchainLoginStatus.html(`RM address:<b style="color: mediumblue">login successfully</b>`);
            doneTransactionStatus();
        }else{
            log(`blockchain login failed`);
            log(result);
            blockchainLoginStatus.html(`RM address:<b style="color: mediumblue">login failed</b>`);
            doneTransactionStatus();
        }
    });
});


function waitTransactionStatus() {
    blockchainLoginProcessStatus.html('Status: <b style="color: blue">processing...</b>')
}

function doneTransactionStatus() {
    blockchainLoginProcessStatus.text('Status:')
}


// mouseover
$(function() {
    blockchainLoginButton.mouseover(function () {
        blockchainLoginButton.attr('style', 'background-color: #608de2' );
    });
    blockchainLoginButton.mouseout(function () {
        blockchainLoginButton.attr('style', 'background-color: #4364a1' );
    });
});


$(function() {
    userInfoButton.mouseover(function () {
        userInfoButton.attr('style', 'background-color: #608de2' );
    });
    userInfoButton.mouseout(function () {
        userInfoButton.attr('style', 'background-color: #4364a1' );
    });
});



