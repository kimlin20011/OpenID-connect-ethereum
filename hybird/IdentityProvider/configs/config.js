//下指令編譯新合約 solcjs -o ./ --bin --abi FourPattern_Two.sol
const fs = require('fs');
require('dotenv').config();

//讀進合約abi,bytecode
const RM_Abi = JSON.parse(fs.readFileSync('./migrate/uma_sol_Resource_management_contract.abi').toString());
const RM_Bytecode = '0x' + fs.readFileSync('./migrate/uma_sol_Resource_management_contract.bin').toString();
const Auth_Abi = JSON.parse(fs.readFileSync('./migrate/uma_sol_Authorization_contract.abi').toString());
const Auth_Bytecode = '0x' + fs.readFileSync('./migrate/uma_sol_Authorization_contract.bin').toString();

module.exports ={
    port: 3001,
    IdP: {
        abi: IdP_Abi,
        bytecode: IdP_Bytecode,
    },
    geth: {
        account: `0x2cf0622bdcdb80a295669c1c1548b0601ec2c41b`,
        //account: `0xdfbc7a1f5f867a9fd73d9fbe9da2b5b34ea67d95`,
        rqp_account: `0x2cf0622bdcdb80a295669c1c1548b0601ec2c41b`,
        //暫時不用
        password: process.env.password,
        gethWebsocketUrl:`ws://localhost:8546`,
        //keystoreDir:`C:\\Users\\nccu\\implement\\chain_new\\data\\keystore`
        keystoreDir:`/Users/nccu/Documents/implement/chain_new/data/keystore`
    },
    mysql:{
        host: process.env.HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }
};
