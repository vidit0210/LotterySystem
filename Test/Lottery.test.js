const assert  = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {interface,bytecode} = require('../compile');

let lottery;
let account;

beforeEach(async()=>{
    account = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
                .deploy({data:bytecode})
                .send({from:account[0],gas:'1000000'});
   
});

describe("Lottery Contract",()=>{
    it('Contract Deployed?',()=>
    {
        assert.ok(lottery.options.address);
    })

    it('Can Enter?', async() => {
        await lottery.methods.enter().send(
            {
                from:account[0],
                value:web3.utils.toWei('0.02','ether')
            }
        )
        await lottery.methods.enter().send(
            {
                from:account[1],
                value:web3.utils.toWei('0.02','ether')
            }
        )
        await lottery.methods.enter().send(
            {
                from:account[2],
                value:web3.utils.toWei('0.02','ether')
            }
        )
        const players = await lottery.methods.getAllplayers().call({
            from:account[0]
        }
        );
        assert.equal(account[0],players[0]);
        assert.equal(3,players.length);
    });

    
});
