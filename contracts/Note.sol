pragma solidity ^0.5.16;

import "./ERC20.sol";

contract Note is ERC20 {
    address private accountant;
    address private admin;

    constructor(string memory name_, string memory symbol_, uint totalSupply_, address admin_) ERC20(name_, symbol_, totalSupply_) public {
	admin = admin_;
    }
    
    modifier AdminOnly {
	require(msg.sender == admin);
	_;
    }

    modifier AccountantOnly {
	require(msg.sender == accountant);
	_;
    }
    
    function _mint_to_Accounting() AccountantOnly public {
	super._mint(accountant, super.totalSupply()); 
    }

    function RetAccountant() public view returns(address) {
	return accountant;
    }
    
    function _setAccoutantAddress(address accountant_) AdminOnly external {
	accountant = accountant_;
    }
}
