pragma solidity ^0.7.0;

contract IdP_contract {
    address public identityProvider;
    
    //將client_id對應到eth address，如此實現虛擬 address 與現實身分的連結 
    struct Client{
        address client_address;
        bytes32 redirect_uri_hash;
        bytes32 client_name_hash;
        bool exist;
    }
    
    /*
    struct id_token{
        uint iss;
        uint sub;
        address aud;
        uint exp;
        uint iat;
        uint c_hash;
    }
    */
    
    //mapping(string => bool) scopes;
    mapping(address => bool) contract_collaborators; //增加resource server註冊resource set的權限
    mapping(uint => Client) public clients; //使用client_id mapping 到client info
    mapping(bytes32 => address) public  authzCode_client_Address; //將authzCode mapping到address，因為一個address可能會擁有多個authzCode (多對一)
    mapping(bytes32 => bytes32) public authzCode_ID_token_hash;
    mapping(bytes32 => address) internal access_token_client_address; //將access_token mapping到擁有他的client_address
    //mapping(bytes32 => bool) internal access_token_exit; 
    mapping(bytes32 => bytes32) internal access_token_refresh_token;
    mapping(bytes32 => uint) public token_vaildTime;
    mapping(bytes32 => string) public authzCode_scopes;
    
    event clientCreated(uint clientId, uint timestamp);
    event clientModified(uint clientId, uint timestamp);
    event addedResourceSet(uint registerTime,string name,bytes32 identifier);
    event authenticationResponse(bytes32 authzCode,bytes32 idTokenHash);
    event id_token(address iss, uint sub, uint aud, uint exp, uint iat);
    event tokenRelease(address msg_sender,bytes32 access_token, bytes32 refresh_token,uint iat, uint exp);
    
    constructor() {
        identityProvider = msg.sender;
        contract_collaborators[identityProvider]=true;
        //先定義存在的scope
        //scopes["openid"] = true;
        //scopes["profile"] = true;
        //scopes["email"] = true;
        //scopes["address"] = true;
    }
    
    
    function clientRegister(string memory _client_name,string memory _redirect_uri) public {
        uint clientID =  uint(keccak256(abi.encodePacked(block.timestamp)))%1000000 +1;
        Client storage RP = clients[clientID];
        RP.client_name_hash= (keccak256(abi.encodePacked(_client_name)));
        RP.client_address = msg.sender;
        RP.redirect_uri_hash = (keccak256(abi.encodePacked(_redirect_uri)));
        RP.exist = true;
        emit clientCreated(clientID, block.timestamp); //回傳 client_id
    }
    
    //fuction for client to modify the client infomation
    function clientConfiguration(uint _clientID, string memory _client_name,string memory _redirect_uri) public {
        require(clients[_clientID].exist == true , "client not exist");//檢查client 是否存在是否輸入錯誤
        require(clients[_clientID].client_address == msg.sender , "vaild address");//檢查client 是否存在是否輸入錯誤
        uint clientID =  uint(keccak256(abi.encodePacked(block.timestamp)))%1000000 +1;
        Client storage RP = clients[clientID];
        RP.client_name_hash= (keccak256(abi.encodePacked(_client_name)));
        RP.redirect_uri_hash = (keccak256(abi.encodePacked(_redirect_uri)));
        emit clientModified(_clientID, block.timestamp); //回傳 client_id,timestamp
    }
    
    function checkClientName(uint _clientID, string memory _client_name) public view returns(bool){
        if(clients[_clientID].client_name_hash == (keccak256(abi.encodePacked(_client_name)))){
            return true;
        }else {
            return false;
        }
    }
    
    function checkClientRedirectUrl(uint _clientID, string memory _redirect_uri) public view returns(bool){
        if(clients[_clientID].redirect_uri_hash == (keccak256(abi.encodePacked(_redirect_uri)))){
            return true;
        }else {
            return false;
        }
    }
    
    //authenticationRequest function應是由 IdP直接呼叫
    function authenticationRequest(uint _clientID, uint _sub, string memory _scope, string memory _redirect_uri) public returns(bool){
        require(contract_collaborators[msg.sender] == true,"Access deny, not contract collaborators"); //先確認發出交易的address是被認可持有對應identityProvider的人
        require(clients[_clientID].exist == true && clients[_clientID].redirect_uri_hash == (keccak256(abi.encodePacked(_redirect_uri))), "client not exist");//檢查client 是否存在與 redirect url是否輸入錯誤
        Client storage RP = clients[_clientID];
        uint random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 code = (keccak256(abi.encodePacked(block.timestamp, msg.sender, random_number)));
        bytes32 idTokenHash = (keccak256(abi.encodePacked(msg.sender, _sub, _clientID, block.timestamp + 1 minutes,block.timestamp)));
        authzCode_client_Address[code] =  RP.client_address; //將authzcode對應到發出authn request的client address
        authzCode_ID_token_hash[code] = idTokenHash;
        authzCode_scopes[code] = _scope;
        emit authenticationResponse (code,idTokenHash);
        emit id_token (msg.sender, _sub, _clientID, block.timestamp + 1 minutes,block.timestamp); //iss, sub, aud, exp, iat
        return true;
    }
    
    function requestToken(bytes32 _code) public returns(bool){
        require(authzCode_client_Address[_code] == msg.sender,"Access deny, not relying party"); //先確認發出交易的address是被認可持有對應identityProvider的人
        uint random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 accessToken = (keccak256(abi.encodePacked(block.timestamp, msg.sender, random_number)));
        uint random_number_1 = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 refreshToken = (keccak256(abi.encodePacked(block.timestamp, random_number, random_number_1)));
        access_token_client_address[accessToken] = msg.sender;
        access_token_refresh_token[accessToken] = refreshToken;
        token_vaildTime[accessToken] = block.timestamp + 2 minutes;
        delete authzCode_client_Address[_code];
        delete authzCode_ID_token_hash[_code];
        emit tokenRelease(msg.sender, accessToken, refreshToken, block.timestamp, token_vaildTime[accessToken]);// msg_sender, access_token,  refresh_token, iat,  exp
        return true;
    }
    
    
    function accessTokenExchange(bytes32 _refreshToken, bytes32 _accessToken) public returns(bool){
            
        require(_refreshToken == access_token_refresh_token[_accessToken], "invaild token");
        require(block.timestamp >= token_vaildTime[_accessToken], "token is vaild");
        require(msg.sender == access_token_client_address[_accessToken]);
        
        delete access_token_client_address[_accessToken];
        delete access_token_refresh_token[_accessToken];
        
        //generate access and refresh token again
        uint random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 accessToken = (keccak256(abi.encodePacked(block.timestamp, msg.sender, random_number)));
        uint random_number_1 = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 refreshToken = (keccak256(abi.encodePacked(block.timestamp, random_number, random_number_1)));
        access_token_client_address[accessToken] = msg.sender;
        access_token_refresh_token[accessToken] = refreshToken;
        token_vaildTime[accessToken] = block.timestamp + 2 minutes;
        emit tokenRelease(msg.sender, accessToken, refreshToken, block.timestamp, token_vaildTime[accessToken]);// msg_sender, access_token,  refresh_token, iat,  exp
        return true;
    }

    function introspectAccessToken(
        bytes32 _token,
        uint8 _v,
        bytes32 _r,
        bytes32 _s) public view returns(bool){

        if(block.timestamp >= token_vaildTime[_token]){
            return false;
        }
        
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        address signer = ecrecover(
            (keccak256(abi.encodePacked(prefix,_token))),
            _v, _r, _s
        );
        
        if(access_token_client_address[_token] != address(0) && access_token_client_address[_token] == signer){
            //if the token's signature is signed by Relying Party
            return true;
        }else{
            return false;
        }
    }
}