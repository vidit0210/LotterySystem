pragma solidity ^0.4.17;

contract Lottery {
    address public Manager;
    //Whoever Deploys the Contract is the Manager;
    address[] public players;
    function Lottery() public{
        Manager = msg.sender;
    }
    
    
    function getAllplayers() public view returns(address[]){
        return players;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

//function should be privae just for testing it is made public
    function random() private view returns(uint){
        return uint(keccak256(block.difficulty,now,players));
    }    
    function pickWinner() public restricted {
        uint index = random()%players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }
    
    modifier restricted(){
    require(msg.sender == Manager);
    _;
    }    
    

}