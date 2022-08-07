//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol"
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract PIRATE is ERC20 {
    
    mapping(address => mapping (address => uint256)) allowed;
    constructor() ERC20('TheBitPirate', 'PIRATE') {
        

        _mint(address(this), 100000 * 10**decimals());
        //  address payable addr=payable(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0);

        // transfer(addr, 100000 * 10**decimals());
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
    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }
    function allowance(address owner, address delegate) public override view returns (uint) {
        return allowed[owner][delegate];
    }
    
    
   

   
}
