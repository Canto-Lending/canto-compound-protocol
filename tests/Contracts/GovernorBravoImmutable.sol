pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "../../contracts/Governance/GovernorBravoDelegateG2.sol";

contract GovernorBravoImmutable is GovernorBravoDelegate {

     constructor(address timelock_) public {
        admin = msg.sender;
        initialize(timelock_);

        // admin = admin_;
    }


    function initialize(address timelock_) public {
        require(msg.sender == admin, "GovernorBravo::initialize: admin only");
        require(address(timelock) == address(0), "GovernorBravo::initialize: can only initialize once");
        
        timelock = TimelockInterface(timelock_);
    }

    function _initiate() public {
        proposalCount = 1;
        initialProposalId = 1;
    }
}
