const assert  = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {interface,bytecode} = require('../compile');

let lottery;
let account;

beforeEach(async()=>{
    account = await web3.eth.getAccounts();
    lottery = await web3.eth.Contract(JSON.parse(interface))
                .deploy({data:bytecode})
                .send({from:account[0],gas:'1000000'});
   
});