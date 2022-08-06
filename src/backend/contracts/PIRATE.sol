//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol"
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract PIRATE is ERC20 {
    address payable public immutable contractOwner;
    constructor() ERC20('TheBitPirate', 'PIRATE') {
        contractOwner=payable(msg.sender);

        _mint(msg.sender, 100000 * 10**decimals());
    }

    function mint() public returns (bool){
        _mint(msg.sender,100000 * 10**decimals());
        return true;
    }
    
    function buyCoin() public payable {
        require(balanceOf(address(this)) > msg.value, 'Not enough tokens');
        _transfer(address(this), msg.sender, msg.value);
    }
    function checkBalance() public payable returns(uint){
        uint amount=msg.value;
        return amount;
    }
    
   

   
}
