# OpenID-connect-ethereum

## 所有合約需要確認的事
* 將blockchain中的虛擬address與實體身分做mapping

## Hybrid
* 簡介
    * IdP 服務透過智能合約之去中心化授權與中心化伺服器之整合，使得認證系統能夠兼具去中心化的不可篡改與可追蹤性，也可以保有中心化系統的授權即時性與可擴展性
    
## Smart Contract API

### `clientRegister`
* 說明：client在進入認證協議之前，必須要將自身資料註冊至智能合約中，在之後能以client身分透過合約進行驗證流程
* input參數
    * client_name
    * client_address
    * redirect_uri
* output (event_type)
    * 基於隱私保護，回傳的event中只能儲存client_id與timestamp，之後要查詢更改儲存內容時，需要驗證發出交易的address身分
    * client_id
    * registration_access_token (不一定要有，可以直接透過驗證發送交易的帳號代替)
    * registration_client_API

### `clientConfiguration`
* 說明：在client註冊完之後，可以透過此API來修改或查看其資訊
* eth_address與 client_id 的關係為一對多，一個eth_address可以持有多個 client_id
* input參數
    * client_id
    * client_address
* * output (return)
    * client_name or client_address


###  `authenticationRequest()`
> authenticationRequest function應是由 End-User直接透過離線簽名去呼叫
* 說明：authorization endpoint 將 End-User 授權過後的內容，以簽章形式註冊至智能合約，並由智能合約發送相關的 ID token 與 Authorization code
    * 簽章是為了確保授權內容真的為End-User的所提供
* input參數
    * scope：bytes32 (IdP事先將scope內容雜湊過後帶入，之後與智能合約中之參數雜湊值比較)
        * 也可以直接帶入string 格式的scope，透過 `_` 將字串間隔
    * client_id
    * redirect_uri
    * state(不一定，可以用在Https之間的傳輸)
* output參數
    * 成功
        * code 
        * id_token
    * 失敗
        * error
        * error_description
    * 透過Event 發出的id_token以 `_` 的方式空格

#### OIDC規格中定義的Https 內容

* client 促使 End-User 重新導向並向Authorization server 發送Authentication Request
```
  HTTP/1.1 302 Found
  Location: https://client.example.org/cb?
    code=SplxlOBeZQQYbYS6WxSbIA
    &state=af0ifjsldkj
```

```
  GET /authorize?
    response_type=code
    &scope=openid%20profile%20email
    &client_id=s6BhdRkqt3
    &state=af0ifjsldkj
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb HTTP/1.1
  Host: server.example.com
```
### `requestToken()`
* 說明：Relying Party 取得 authorization code之後，直接向Smart contract請求token
* input
    *  grant_type
    *  code
* Output
    * access_token
    * refresh_token
    * expires_in
    * authorized_address


### `inrospectToken()`
* 說明：智能合約提供Identity profile API可以驗證Relying Party 所提供 token的正確性
* input
    *  access_token
    *  sign
* Output
    * true/false 


### 動態示意圖
* End-User在 Provide secret signed by PvK 階段，需要提供scope等授權資料的簽章，以在智能合約中能夠驗證 authentication information 真的是由end-user 所提供

![](https://i.imgur.com/8wHapP8.png)


### 智能合約

## Implicit
* 簡介
    * 將IdP的中心化伺服器服務全部以去中心化之智能合約取代，解決中心化驗證機制面臨的可靠性與完整性問題。
    * 缺點是缺乏即時驗證，與透過前端的重新導向機制，即時取得使用者授權的彈性，第三方智能合約必須要授權 Replying Party 代為要求使用者提供授權認證的內容。透過區塊鏈驗證也缺乏使用前端認證的彈性
    * 在這個流程中，使用者需要間接透過Reply Party參與認證資料授權的流程 (但是使用者不會接觸到token等機密資料)
        * 區塊鏈off-chain transaction 的機制能夠確保 End-User 透過 Relying Party上的節點將授權憑證上鏈時，不被Replying Party 竄改
        


* Implicit
![](https://i.imgur.com/uXX7IyZ.png)

###### tags: `區塊鏈物聯網研究`