// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";



contract Marketplace is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        address payable owner;
        bool forSale;
    }
    

    // itemId -> Item
    mapping(uint => Item) public items;
  


    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer  
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
         require(_price >= 0, "Price can't be negative");
        // increment itemCount
        itemCount ++;



        
        
        
        // add new item to items mapping

        // if price is 0 than dont put it for sale
        if(_price==0){
            items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            payable(msg.sender),
            false
            );
        }
        if(_price>0){

            // transfer nft
            _nft.transferFrom(msg.sender, address(this), _tokenId);
            
            items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            payable(address(0)),
            true
            );
        
        
        // emit Offered event
            emit Offered(
                itemCount,
                address(_nft),
                _tokenId,
                _price,
                msg.sender
            );
        }
    }

    function purchaseItem(uint _itemId) external payable nonReentrant returns(address) {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
       
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.forSale=false;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
            
        );
        item.owner=payable(msg.sender);
        return(msg.sender);
    }
    
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
    
    function  getNFTSeller(uint _itemId) view public returns(address){
        return ((items[_itemId].seller));
    }
    
    function changeNFTHolder (uint _itemId ,address payable _seller) public {
        Item storage item = items[_itemId];
        item.seller= payable(_seller);
    }
    
    function setPrice(uint _itemId,uint _price) public{
        Item storage item = items[_itemId];
        item.price=_price;
        item.owner=payable(msg.sender);
        item.forSale=true;
    }

    // function setForSale(uint _itemId,bool _forSale) public{
    //     Item storage item = items[_itemId];
    //     item.forSale=_forSale;
    // }
    function removeFromSale(uint _itemId) public{
         Item storage item = items[_itemId];
         item.forSale =false;
         item.owner=payable(msg.sender);
    }
}
