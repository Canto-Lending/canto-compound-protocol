pragma solidity ^0.5.16;

import "./ERC20.sol";

contract Note is ERC20 {
    address private accountant = address(0);
    address private admin;

    constructor() ERC20("Note", "NOTE", 1000000000) public {
	    admin = msg.sender;
    }

    function _mint_to_Accounting() public {
        require(msg.sender == admin);
	    _mint(accountant, 1000); 
    }

    function RetAccountant() public view returns(address) {
	    return accountant;
    }
    
    function _setAccoutantAddress(address accountant_) external {
        require(msg.sender == admin);
	    accountant = accountant_;
    }
}
