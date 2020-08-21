//這個合約還沒經過但測試，修改token過期時間之檢查
//編譯指令
//solcjs -o ../migrate --bin --abi uma_4.sol
pragma solidity ^0.7.0;

contract IdP_contract {
    address public identityProvider;
    
    
    //將client_id對應到eth address，如此實現虛擬 address 與現實身分的連結 
    struct Client{
        string client_address;
        string redirect_uri;
        string client_name;
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
    
    mapping(string => bool) scopes;
    mapping(address => bool) contract_collaborators; //增加resource server註冊resource set的權限
    mapping(bytes32 => Client) clients; //使用client_id mapping 到client info
    mapping(bytes32 => address) public  authzCode_clientAddress; //將authzCode mapping到address，因為一個address可能會擁有多個authzCode (多對一)
    mapping(bytes32 => bytes32) public authzCode_ID_token_hash;
    mapping(bytes32 => address) internal access_token_client_address; //將access_token mapping到擁有他的client_address
    //mapping(bytes32 => bool) internal access_token_exit; 
    mapping(bytes32 => bytes32) internal access_token_refresh_token;
    mapping(bytes32 => uint) public token_vaildTime;
    
    event clientCreated(bytes32 clientId, uint timestamp);
    event addedResourceSet(uint registerTime,string name,bytes32 identifier);
    event authenticationResponse(bytes32 authzCode, idTokenHash);
    event id_token(uint iss, uint sub, address aud, uint exp, uint iat);
    event tokenRelease(address msg_sender,bytes32 access_token, bytes32 refresh_token,uint iat, uint exp);
    
    constructor() {
        identityProvider = msg.sender;
        contract_collaborators[identityProvider]=true;
        //先定義存在的scope
        scopes["openid"] = true;
        scopes["profile"] = true;
        scopes["email"] = true;
        scopes["address"] = true;
    }
    
    
    function clientRegister(string memory _client_name,string memory _redirect_uri) public {
        address tx_address = msg.sender;
        uint random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 clientID = (keccak256(abi.encodePacked(block.timestamp, msg.sender, random_number))) ;
        Client storage RP = clients[clientID];
        RP.client_name = _client_name;
        RP.client_address = msg.sender;
        RP.redirect_uri = _redirect_uri;
        emit clientCreated(clientID, block.timestamp); //回傳 client_id
    }
    
    //authenticationRequest function應是由 IdP直接呼叫
    function authenticationRequest(bytes32 _clientID, uint _sub, string memory _scope, string memory _redirect_uri) public returns(bool){
        require(contract_collaborators[msg.sender] == true,"Access deny, not contract collaborators") //先確認發出交易的address是被認可持有對應identityProvider的人
        Client storage RP = clients[clientID];
        uint random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 code = (keccak256(abi.encodePacked(block.timestamp, msg.sender, random_number)));
        bytes32 idTokenHash = (keccak256(abi.encodePacked(msg.sender, _sub, _clientID, block.timestamp + 5 minutes,block.timestamp)));
        authzCode_address[code] =  RP.client_address;
        authzCode_ID_token_hash[code] = idTokenHash;
        emit authenticationResponse (code);
        emit id_token (msg.sender, _sub, _clientID, block.timestamp + 60 minutes,block.timestamp); //iss, sub, aud, exp, iat
        return true;
    }
    
    function requestToken(address _code) public returns(bool){
        require(authzCode_clientAddress[_code] == msg.sender,"Access deny, not relying party") //先確認發出交易的address是被認可持有對應identityProvider的人
        uint random_number = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 accessToken = (keccak256(abi.encodePacked(block.timestamp, msg.sender, random_number)));
        uint random_number_1 = uint(keccak256(abi.encodePacked(block.timestamp)))%100 +1;
        bytes32 refreshToken = (keccak256(abi.encodePacked(block.timestamp, random_number, random_number_1)));
        access_token_client_address[accessToken] = msg.sender;
        token_vaildTime[accessToken] = block.timestamp + 6 minutes;
        emit tokenRelease(msg.sender, accessToken, refreshToken, block.timestamp, token_vaildTime[accessToken])// msg_sender, access_token,  refresh_token, iat,  exp
        return true;
    }
    
    function inrospectToken(bytes32 _identifier) public view returns(bool){
        return identifierCheck[_identifier];
    }
    
    function checkScope(bytes32 _identifier) public view returns(string memory){
        return resources[_identifier].scope;
    }
    
    function checkName(bytes32 _identifier) public view returns(string memory){
        return resources[_identifier].name;
    }
    
    function checkReresourceServer(address _resourceServer
    ) public view returns(bool){
        return resourceServers[_resourceServer];
    }
    
}


