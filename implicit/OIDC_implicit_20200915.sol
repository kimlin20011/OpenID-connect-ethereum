pragma solidity ^0.7.0;

contract IdP_contract {
    address public identityProvider;
    //將client_id對應到eth address，如此實現虛擬 address 與現實身分的連結 
    struct Client{
        address client_address;
        bytes32 client_name_hash;
        bool exist;
    }
    
    mapping(address => bool) contract_collaborators; //增加resource server註冊resource set的權限
    mapping(address => bool) public userExist;
    mapping(address => uint) public userID;
    mapping(uint => Client) public clients; //使用client_id mapping 到client info
    mapping(bytes32 => uint) public authnCode_clientID; //多對一
    mapping(bytes32 => string) public authnCode_scope; //一對一
    mapping(bytes32 => bytes32) internal accessToken_refreshToken;
    mapping(bytes32 => uint) public accessToken_vaildTime;
    mapping(bytes32 => address) internal accessToken_clientAddress; //將access_token mapping到擁有他的client_address
    mapping(bytes32 => uint) public accessToken_userID;
    
    event userCreated(uint clientId, uint timestamp);
    event clientCreated(uint clientId, uint timestamp);
    event clientModified(uint clientId, uint timestamp);
    event authnRequestRegistered(uint clientId, bytes32 authnCode, uint timestamp);
    event id_token(address iss, uint sub, address aud, uint exp, uint iat);
    event tokenRelease(address msg_sender,bytes32 access_token, bytes32 refresh_token,uint iat, uint exp);
    
    constructor() {
        identityProvider = msg.sender;
        contract_collaborators[identityProvider]=true;
    }
    
    
    function UserRegister(uint _userID, address _userAddress) public {
        userExist[_userAddress] = true;
        userID[_userAddress] = _userID;
        emit userCreated(userID[_userAddress], block.timestamp); //回傳 userID,  timestamp
    }
    
    function clientRegister(string memory _client_name) public {
        uint clientID =  uint(keccak256(abi.encodePacked(block.timestamp)))%1000000 +1;
        Client storage RP = clients[clientID];
        RP.client_name_hash= (keccak256(abi.encodePacked(_client_name)));
        RP.client_address = msg.sender;
        RP.exist = true;
        emit clientCreated(clientID, block.timestamp); //回傳 client_id
    }
    
    //fuction for client to modify the client infomation
    function clientConfiguration(uint _clientID, string memory _client_name) public {
        require(clients[_clientID].exist == true , "client not exist");//檢查client 是否存在是否輸入錯誤
        require(clients[_clientID].client_address == msg.sender , "vaild address");//檢查client 是否存在是否輸入錯誤
        uint clientID =  uint(keccak256(abi.encodePacked(block.timestamp)))%1000000 +1;
        Client storage RP = clients[clientID];
        RP.client_name_hash= (keccak256(abi.encodePacked(_client_name)));
        emit clientModified(_clientID, block.timestamp); //回傳 client_id,timestamp
    }
    
    function authorize(uint _clientID, string memory _scope) public {
        require(clients[_clientID].client_address == msg.sender,"Access deny, invalid client address"); //先確認發出交易的address是client
        require(clients[_clientID].exist == true, "client not exist");//檢查client 是否存在
        uint random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 authn_code = keccak256(abi.encodePacked(msg.sender, random_number));
        authnCode_clientID[authn_code] = _clientID;
        authnCode_scope[authn_code] = _scope;
        emit authnRequestRegistered(_clientID,authn_code,block.timestamp);
    }
    
    
    function userConsent(bytes32 _authnCode,
        uint8 _v,
        bytes32 _r,
        bytes32 _s) public {
            
        require(authnCode_clientID[_authnCode] != 0,"Access deny, invalid authnCode"); 
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        
        //user需要將authnCode與授權的scope一同簽章
        address signer = ecrecover(
            (keccak256(abi.encodePacked(prefix,_authnCode,authnCode_scope[_authnCode]))),
            _v, _r, _s
        );
        
        if(userExist[signer] == true){
            uint random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
            bytes32 accessToken = (keccak256(abi.encodePacked(block.timestamp, msg.sender, random_number)));
            uint random_number_1 = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
            bytes32 refreshToken = (keccak256(abi.encodePacked(block.timestamp, random_number, random_number_1)));
            accessToken_vaildTime[accessToken] = block.timestamp + 2 minutes;
            accessToken_refreshToken[accessToken] = refreshToken;
            accessToken_clientAddress[accessToken] = msg.sender;
            accessToken_userID[accessToken] = userID[signer];
            delete authnCode_clientID[_authnCode];
            delete authnCode_scope[_authnCode];
            emit id_token (identityProvider, userID[signer], msg.sender, block.timestamp + 1 minutes,block.timestamp); //iss, sub, aud, exp, iat
            emit tokenRelease(msg.sender, accessToken, refreshToken, block.timestamp, accessToken_vaildTime[accessToken]);// msg_sender, access_token,  refresh_token, iat,  exp
        } else {
            require(1 == 0, "invalid user");
        }
    }
      
    function accessTokenExchange(bytes32 _refreshToken, bytes32 _accessToken) public returns(bool){
            
        require(_refreshToken == accessToken_refreshToken[_accessToken], "invaild token");
        require(block.timestamp >= accessToken_vaildTime[_accessToken], "token is vaild");
        require(msg.sender == accessToken_clientAddress[_accessToken]);
        
        delete accessToken_clientAddress[_accessToken];
        delete accessToken_refreshToken[_accessToken];
        delete accessToken_userID[_accessToken];
        delete accessToken_vaildTime[_accessToken];
        
        //generate access and refresh token again
        uint random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 accessToken = (keccak256(abi.encodePacked(block.timestamp, msg.sender, random_number)));
        uint random_number_1 = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 refreshToken = (keccak256(abi.encodePacked(block.timestamp, random_number, random_number_1)));
        accessToken_clientAddress[accessToken] = msg.sender;
        accessToken_refreshToken[accessToken] = refreshToken;
        accessToken_vaildTime[accessToken] = block.timestamp + 2 minutes;
        emit tokenRelease(msg.sender, accessToken, refreshToken, block.timestamp, accessToken_vaildTime[accessToken]);// msg_sender, access_token,  refresh_token, iat,  exp
        return true;
    }

    function introspectAccessToken(
        bytes32 _token,
        uint8 _v,
        bytes32 _r,
        bytes32 _s) public view returns(bool){

        if(block.timestamp >= accessToken_vaildTime[_token]){
            return false;
        }
        
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        address signer = ecrecover(
            (keccak256(abi.encodePacked(prefix,_token))),
            _v, _r, _s
        );
        
        if(accessToken_clientAddress[_token] == signer){
            //if the token's signature is signed by Relying Party
            return true;
        }else{
            return false;
        }
    }
    
}