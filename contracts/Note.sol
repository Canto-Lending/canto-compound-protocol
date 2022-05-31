pragma solidity ^0.5.16;

import "./ERC20.sol";


contract Note is ERC20 {
    address private Admin;
    address private Treasury;
    
    constructor(string memory name_, string memory symbol, uint256 totalSupply_) ERC20(name_, symbol, totalSupply_) public {
        Admin =  msg.sender;
    }

    modifier TreasuryOnly {
	require(msg.sender == Treasury);
	_;
    }
    
    function _mint_to_Treasury() TreasuryOnly public {
	super._mint(Treasury, super.totalSupply()); 
    }

    function RetTreasury() public returns(address) {
	return Treasury;
    }
    
    function _setTreasuryAddress(address pendingTreasuryAddr) external {
	if (msg.sender == Admin) {
	    Treasury = pendingTreasuryAddr; 
	}
    }
}
