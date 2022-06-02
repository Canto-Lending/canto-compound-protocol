pragma experimental ABIEncoderV2;

import "contracts/IProposal.sol";
import "contracts/EIP20Interface.sol";
import "contracts/Lens/CompoundLens.sol";
import "contracts/Comptroller.sol";

/** 
* @title    Canto Treasury  - A smart contract that holds the Canto Network's assets
*                            and includes functionality to execute Unigov proposals
*
* @author   TK Kwon         - tk@plex.engineer
*/
contract Treasury {

    //boolean to determine whether or not the Treasury has entered into the cNote Market
    bool private NoteMarketEntered = false;
    // Unigov address that is set with constructor at deployment
    address private UNIGOV_ADDRESS;
    // Interfaces
    EIP20Interface public note;
    IProposal public unigov;
    // Constructor that takes in 2 variables:
    //      - unigovContractAddress:    the address of the map contract which stores proposals passed by Cosmos SDK
    //      - noteAddressERC20:         the address of the ERC20 contract for nxote
    constructor(address unigovContractAddress, address noteAddressERC20) public {

        UNIGOV_ADDRESS = unigovContractAddress;
        unigov = IProposal(UNIGOV_ADDRESS);
	
        note = EIP20Interface(noteAddressERC20);
        require(note.totalSupply() > 0, "Sanity check to make sure address is valid");
    }

    // Receive payable allows contract to receive CANTO
    function() external payable {}

    // External function to query balance of Canto
    function queryCantoBalance() external view returns (uint) {
        uint treasuryCantoBalance = address(this).balance;
        return treasuryCantoBalance;
    }

    // External function to query balance of Note
    function queryNoteBalance() external view returns (uint) {
        uint treasuryNoteBalance = note.balanceOf(address(this));
        return treasuryNoteBalance;
    }

    // External function to test that query proposal is working
    function _queryProposal(uint proposalID) external view returns (IProposal.Proposal memory) {
        IProposal.Proposal memory proposal = unigov.QueryProp(proposalID);
        return proposal;
    }

    // Executes function by querying proposal and calling sendFund
    function executeProposal(uint proposalID) external {
        // query the proposal using the proposalID
        IProposal.Proposal memory proposal = unigov.QueryProp(proposalID);

        for (uint i=0; i<proposal.targets.length; i++) {
            address recipient = proposal.targets[i];
            uint amount = proposal.values[i];
            string memory denom = proposal.signatures[i];

            // for each recipient, sending according amount of denom
            sendFund(recipient, amount, denom);
        }
    }
    

    function queryProposal(uint proposalID) internal view returns (IProposal.Proposal memory){

        // query proposal
        IProposal.Proposal memory proposal = unigov.QueryProp(proposalID);

        // sanity check to see if targets, values, and signatures are all equal length
        require(proposal.targets.length == proposal.values.length);
        require(proposal.targets.length == proposal.signatures.length);

        for (uint i=0; i<proposal.targets.length; i++) {

            uint amount = proposal.values[i];
            string memory denom = proposal.signatures[i];

            // cast denom to bytes to check length
            bytes memory denomBytes = bytes(denom);
            
            // checks before returning to execute function
            require(amount > 0, "Amount is invalid: must be uint greater than 0");
            require(denomBytes.length > 0, "Denom is invalid; must be a string with length greater than 0");
        }

        return proposal;
    }

    // Internal function to send funds to recipient address
    function sendFund(address recipient, uint amount, string memory denom) internal {
        address payable to = address(uint160(recipient));

        // sending CANTO
        if (keccak256(bytes(denom)) == keccak256(bytes("CANTO"))) {
            to.transfer(amount);
        } 
        // sending NOTE
        else if (keccak256(bytes(denom)) == keccak256(bytes("NOTE"))) {
            note.transfer(recipient, amount);
        }   
    }
}
