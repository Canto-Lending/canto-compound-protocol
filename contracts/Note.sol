pragma solidity ^0.5.16;

import "./ERC20.sol";


contract Note is ERC20 {
    address private LendingMarket;
    
    constructor(string memory name_, string memory symbol, uint256 totalSupply_, address LendingMarket_) public ERC20(name_, symbol, totalSupply_){
	LendingMarket = LendingMarket_;
    }

    modifier LendingMarketOnly {
	require(msg.sender == LendingMarket);
	_;
    }
    function _mint_to_LendingMarket() external LendingMarketOnly {
	super._mint(LendingMarket, super.totalSupply()); 
    }
}
