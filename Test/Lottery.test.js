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

    it("Can Enter one",async()=>{
        await lottery.methods.enter().send({
            from:account[0],
            value:web3.utils.toWei('0.03','ether')
        });
    });

    it('Can Enter many?', async() => {
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

    //He we are trying to pass a test where we fail entering the amount
    it('Requires Mininmum Amount of Ether',async()=>{
        try{
            await lottery.methods.enter().send({
                from:account[0],
                value:20
            })
            assert(false);
        }catch(err){
            assert(err);
        }

    });
    
    //Only Manager can call pick winner
    it('Only Manager can Pick The Winner',async()=>{
        try{
            await lottery.methods.pickWinner().send({
                from:account[1]
            })
            assert(false)
        }catch(err){
            assert(err);
        }
    })

    it('Sends Money to Winner and Resets the Array',async()=>{
        await lottery.methods.enter().send({
            from:account[0],
            value:web3.utils.toWei('2','ether')
        });


        const initialBalance = await web3.eth.getBalance(account[0]);
        await lottery.methods.pickWinner().send({
            from:account[0]
        });
        const finalBalance = await web3.eth.getBalance(account[0]);
        const diiference  = finalBalance-initialBalance;
        console.log("Difference with effect of Gas:",diiference)
        assert(diiference>web3.utils.toWei('1.8','ether'));
    });
  
});
