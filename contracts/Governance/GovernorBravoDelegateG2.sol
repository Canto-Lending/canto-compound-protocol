pragma solidity >= 0.5.16;
pragma experimental ABIEncoderV2;

import "./GovernorBravoInterfaces.sol";

contract GovernorBravoDelegate is GovernorBravoDelegateStorageV2, GovernorBravoEvents {
/*
    TODO: remove all constants related to creating and approving proposals

      /// @notice The name of this contract
      string public constant name = "Compound Governor Bravo";

      /// @notice The minimum setable proposal threshold
      uint public constant MIN_PROPOSAL_THRESHOLD = 50000e18; // 50,000 c

      /// @notice The maximum setable proposal threshold
      uint public constant MAX_PROPOSAL_THRESHOLD = 100000e18; //100,000 c

      /// @notice The minimum setable voting period
      uint public constant MIN_VOTING_PERIOD = 5760; // About 24 hours

      /// @notice The max setable voting period
      uint public constant MAX_VOTING_PERIOD = 80640; // About 2 weeks

      /// @notice The min setable voting delay
      uint public constant MIN_VOTING_DELAY = 1;

      /// @notice The max setable voting delay
      uint public constant MAX_VOTING_DELAY = 40320; // About 1 week

      /// @notice The number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed
      uint public constant quorumVotes = 400000e18; // 400,000 = 4% of c
      */

    /// @notice The maximum number of actions that can be included in a proposal
    uint public constant proposalMaxOperations = 10; // 10 actions
    
    // TODO: figure out if we need DOMAIN_TYPEHASH
      /// @notice The EIP-712 typehash for the contract's domain
      // bytes32 public constant DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,uint256 chainId,address verifyingContract)");
      //seo_delete

    // TODO: delete BALLOT_TYPEHASH
      /// @notice The EIP-712 typehash for the ballot struct used by the contract
      // bytes32 public constant BALLOT_TYPEHASH = keccak256("Ballot(uint256 proposalId,uint8 support)");
      // seo_delete

    /**
      * @notice Used to initialize the contract during delegator contructor
      * @param timelock_ The address of the Timelock
      */
    // TODO: remove canto address and initialization from here since canto is native token
    //, address canto_
    function initialize(address timelock_) public {
        require(address(timelock) == address(0), "GovernorBravo::initialize: can only initialize once");
        require(msg.sender == admin, "GovernorBravo::initialize: admin only");
        require(timelock_ != address(0), "GovernorBravo::initialize: invalid timelock address");

        // TODO: replace canto initialization with canto initialization 
        //@seo: make canto
        //require(canto_ != address(0), "GovernorBravo::initialize: invalid cnato  address");
        
        // require(votingPeriod_ >= MIN_VOTING_PERIOD && votingPeriod_ <= MAX_VOTING_PERIOD, "GovernorBravo::initialize: invalid voting period");
        // require(votingDelay_ >= MIN _VOTING_DELAY && votingDelay_ <= MAX_VOTING_DELAY, "GovernorBravo::initialize: invalid voting delay");
        // require(proposalThreshold_ >= MIN_PROPOSAL_THRESHOLD && proposalThreshold_ <= MAX_PROPOSAL_THRESHOLD, "GovernorBravo::initialize: invalid proposal threshold");

        timelock = TimelockInterface(timelock_);
        // TODO: replace canto and CompInterface with Canto declaration
        //@seo: canto interface is introduced
        //canto = CantoInterface(canto_);
    
        /*
          TODO: delete these; no need for voting logic
          votingPeriod = votingPeriod_;
          votingDelay = votingDelay_;
          proposalThreshold = proposalThreshold_;
          */
    }

    /**
      * @notice Function used to propose a new proposal. Sender must have delegates above the proposal threshold
      * @param targets Target addresses for proposal calls
      * @param values Eth values for proposal calls
      * @param signatures Function signatures for proposal calls
      * @param calldatas Calldatas for proposal calls
      * @param description String description of the proposal
      * @return Proposal id of new proposal
      */
      /**
      TODO: delete this propose function; proposals will be sent from off-chain and directly to the queue function below
        // function propose(address[] memory targets, uint[] memory values, string[] memory signatures, bytes[] memory calldatas, string memory description) public returns (uint) {
        //     // Reject proposals before initiating as Governor
        //     require(initialProposalId != 0, "GovernorBravo::propose: Governor Bravo not active");
        //     // Allow addresses above proposal threshold and whitelisted addresses to propose
        //     require(comp.getPriorVotes(msg.sender, sub256(block.number, 1)) > proposalThreshold || isWhitelisted(msg.sender), "GovernorBravo::propose: proposer votes below proposal threshold");
        //     require(targets.length == values.length && targets.length == signatures.length && targets.length == calldatas.length, "GovernorBravo::propose: proposal function information arity mismatch");
        //     require(targets.length != 0, "GovernorBravo::propose: must provide actions");
        //     require(targets.length <= proposalMaxOperations, "GovernorBravo::propose: too many actions");

        //     uint latestProposalId = latestProposalIds[msg.sender];
        //     if (latestProposalId != 0) {
        //       ProposalState proposersLatestProposalState = state(latestProposalId);
        //       require(proposersLatestProposalState != ProposalState.Active, "GovernorBravo::propose: one live proposal per proposer, found an already active proposal");
        //       require(proposersLatestProposalState != ProposalState.Pending, "GovernorBravo::propose: one live proposal per proposer, found an already pending proposal");
        //     }

        //     uint startBlock = add256(block.number, votingDelay);
        //     uint endBlock = add256(startBlock, votingPeriod);

        //     proposalCount++;
        //     Proposal memory newProposal = Proposal({
        //         id: proposalCount,
        //         proposer: msg.sender,
        //         eta: 0,
        //         targets: targets,
        //         values: values,
        //         signatures: signatures,
        //         calldatas: calldatas,
        //         startBlock: startBlock,
        //         endBlock: endBlock,
        //         forVotes: 0,
        //         againstVotes: 0,
        //         abstainVotes: 0,
        //         canceled: false,
        //         executed: false
        //     });

        //     proposals[newProposal.id] = newProposal;
        //     latestProposalIds[newProposal.proposer] = newProposal.id;

        //     // emit ProposalCreated(newProposal.id, msg.sender, targets, values, signatures, calldatas, startBlock, endBlock, description);
        //     return newProposal.id;
        // }

    /**
      * @notice Queues a proposal of state succeeded
      * @param proposalId The id of the proposal to queue
      */
    function queue(uint proposalId) external {
        // require(state(proposalId) == ProposalState.Succeeded, "GovernorBravo::queue: proposal can only be queued if it is succeeded");

        // TODO: add proper queue logic once we have figure out a solution for fetching proposals
        //Proposal storage proposal = proposals[proposalId];
        // TODO: need to look into definition of timelock delay - make sure it meets our requirements
        uint eta = add256(block.timestamp, timelock.delay());
        // for (uint i = 0; i < proposal.targets.length; i++) {
        //     queueOrRevertInternal(proposal.targets[i], proposal.values[i], proposal.signatures[i], proposal.calldatas[i], eta);
        // }
        // proposal.eta = eta;
        emit ProposalQueued(proposalId, eta);
    }

    function queueOrRevertInternal(address target, uint value, string memory signature, bytes memory data, uint eta) internal {
        require(!timelock.queuedTransactions(keccak256(abi.encode(target, value, signature, data, eta))), "GovernorBravo::queueOrRevertInternal: identical proposal action already queued at eta");
        timelock.queueTransaction(target, value, signature, data, eta);
    }

    /**
      * @notice Executes a queued proposal if eta has passed
      * @param proposalId The id of the proposal to execute
      */
        // function execute(uint proposalId) external payable {
        //     require(state(proposalId) == ProposalState.Queued, "GovernorBravo::execute: proposal can only be executed if it is queued");
        //     Proposal storage proposal = proposals[proposalId];
        //     proposal.executed = true;
        //     for (uint i = 0; i < proposal.targets.length; i++) {
        //         timelock.executeTransaction.value(proposal.values[i])(proposal.targets[i], proposal.values[i], proposal.signatures[i], proposal.calldatas[i], proposal.eta);
        //     }
        //     emit ProposalExecuted(proposalId);
        // }

    /**
      * @notice Cancels a proposal only if sender is the proposer, or proposer delegates dropped below proposal threshold
      * @param proposalId The id of the proposal to cancel
      */
    function cancel(uint proposalId) external {
        // TODO: only admin can cancel contracts; change logic here accordingly
        //@seo: admin checking
        require(msg.sender == admin, "GovernorBravo::_setVotingDelay: admin only");
        require(state(proposalId) != ProposalState.Executed, "GovernorBravo::cancel: cannot cancel executed proposal");
        
        // TODO: add logic to properly cancel proposal once unified governance is solved
        // Proposal storage proposal = proposals[proposalId];

        // Proposer can cancel
            // if(msg.sender != proposal.proposer) {
            //     // Whitelisted proposers can't be canceled for falling below proposal threshold
            //     // comp->canto seo_modified
            //     if(isWhitelisted(proposal.proposer)) {
            //         require((comp.getPriorVotes(proposal.proposer, sub256(block.number, 1)) < proposalThreshold) && msg.sender == whitelistGuardian, "GovernorBravo::cancel: whitelisted proposer");
            //     }
            //     else {
            //         require((comp.getPriorVotes(proposal.proposer, sub256(block.number, 1)) < proposalThreshold), "GovernorBravo::cancel: proposer above threshold");
            //     }
            // }
        
        // proposal.canceled = true;
        // for (uint i = 0; i < proposal.targets.length; i++) {
        //     timelock.cancelTransaction(proposal.targets[i], proposal.values[i], proposal.signatures[i], proposal.calldatas[i], proposal.eta);
        // }

        emit ProposalCanceled(proposalId);
    }

    // TODO: bring getActions back once unified governance solution is solved
    /*
      * @notice Gets actions of a proposal
      * @param proposalId the id of the proposal
      * @return Targets, values, signatures, and calldatas of the proposal actions
      */
    // function getActions(uint proposalId) external view returns (address[] memory targets, uint[] memory values, string[] memory signatures, bytes[] memory calldatas) {
    //     Proposal storage p = proposals[proposalId];
    //     return (p.targets, p.values, p.signatures, p.calldatas);
    // }

    // TODO: delete getReceipt
    /**
      * @notice Gets the receipt for a voter on a given proposal
      * @param proposalId the id of proposal
      * @param voter The address of the voter
      * @return The voting receipt
      */
    // function getReceipt(uint proposalId, address voter) external view returns (Receipt memory) {
    //     return proposals[proposalId].receipts[voter];
    // }

    /**
      * @notice Gets the state of a proposal
      * @param proposalId The id of the proposal
      * @return Proposal state
      */
    function state(uint proposalId) public view returns (ProposalState) {
        // TODO: remove all logic related to proposal voting from here
        // TODO: delete PENDING, DEFEATED, Canceled, Active, Succeeded state logic
        require(proposalCount >= proposalId && proposalId > initialProposalId, "GovernorBravo::state: invalid proposal id");
        return ProposalState.Expired;

        // TODO: add proper logic for fetching proposals after unified governance is solved
        // Proposal storage proposal = proposals[proposalId];
        // if (proposal.canceled) {
        //     return ProposalState.Expired;
        //   // } else if (block.number <= proposal.startBlock) {
        //   //     return ProposalState.Pending;
        //   // } else if (block.number <= proposal.endBlock) {
        //   //     return ProposalState.Active;
        //   // } else if (proposal.forVotes <= proposal.againstVotes || proposal.forVotes < quorumVotes) {
        //   //     return ProposalState.Defeated;
        //   // } else if (proposal.eta == 0) {
        //   //     return ProposalState.Succeeded;
        // } else if (proposal.executed) {
        //     return ProposalState.Executed;
        // // TODO: when is the Expired state needed? why add a grace period?
        // } else if (block.timestamp >= add256(proposal.eta, timelock.GRACE_PERIOD())) {
        //     return ProposalState.Expired;
        // } else {
        //     return ProposalState.Queued;
        // }
    }

    // TODO: delete castVote
    /**
      * @notice Cast a vote for a proposal
      * @param proposalId The id of the proposal to vote on
      * @param support The support value for the vote. 0=against, 1=for, 2=abstain
      */
        // function castVote(uint proposalId, uint8 support) external {
        //     emit VoteCast(msg.sender, proposalId, support, castVoteInternal(msg.sender, proposalId, support), "");
        // }

    // TODO: delete castVoteWithReason
    /**
      * @notice Cast a vote for a proposal with a reason
      * @param proposalId The id of the proposal to vote on
      * @param support The support value for the vote. 0=against, 1=for, 2=abstain
      * @param reason The reason given for the vote by the voter
      */
        // function castVoteWithReason(uint proposalId, uint8 support, string calldata reason) external {
        //     emit VoteCast(msg.sender, proposalId, support, castVoteInternal(msg.sender, proposalId, support), reason);
        // }

    // TODO: delete castVoteBySig
        // /**
        // * @notice Cast a vote for a proposal by signature
        // * @dev External function that accepts EIP-712 signatures for voting on proposals.
        // */
        // function castVoteBySig(uint proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s) external {
        //     bytes32 domainSeparator = keccak256(abi.encode(DOMAIN_TYPEHASH, keccak256(bytes(name)), getChainIdInternal(), address(this)));
        //     bytes32 structHash = keccak256(abi.encode(BALLOT_TYPEHASH, proposalId, support));
        //     bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        //     address signatory = ecrecover(digest, v, r, s);
        //     require(signatory != address(0), "GovernorBravo::castVoteBySig: invalid signature");
        //     emit VoteCast(signatory, proposalId, support, castVoteInternal(signatory, proposalId, support), "");
        // }

    // TODO: delete castVoteInternal
    /**
      * @notice Internal function that caries out voting logic
      * @param voter The voter that is casting their vote
      * @param proposalId The id of the proposal to vote on
      * @param support The support value for the vote. 0=against, 1=for, 2=abstain
      * @return The number of votes cast
      */
        // function castVoteInternal(address voter, uint proposalId, uint8 support) internal returns (uint96) {
        //     require(state(proposalId) == ProposalState.Active, "GovernorBravo::castVoteInternal: voting is closed");
        //     require(support <= 2, "GovernorBravo::castVoteInternal: invalid vote type");
        //     Proposal storage proposal = proposals[proposalId];
        //     Receipt storage receipt = proposal.receipts[voter];
        //     require(receipt.hasVoted == false, "GovernorBravo::castVoteInternal: voter already voted");
        //     uint96 votes = comp.getPriorVotes(voter, proposal.startBlock);

        //     if (support == 0) {
        //         proposal.againstVotes = add256(proposal.againstVotes, votes);
        //     } else if (support == 1) {
        //         proposal.forVotes = add256(proposal.forVotes, votes);
        //     } else if (support == 2) {
        //         proposal.abstainVotes = add256(proposal.abstainVotes, votes);
        //     }

        //     receipt.hasVoted = true;
        //     receipt.support = support;
        //     receipt.votes = votes;

        //     return votes;
        // }
    
    // TODO: delete isWhitelisted
    /**
     * @notice View function which returns if an account is whitelisted
     * @param account Account to check white list status of
     * @return If the account is whitelisted
     */
        // function isWhitelisted(address account) public view returns (bool) {
        //     return (whitelistAccountExpirations[account] > now);
        // }

    // TODO: delete _setVotingDelay
    /**
      * @notice Admin function for setting the voting delay
      * @param newVotingDelay new voting delay, in blocks
      */
        // function _setVotingDelay(uint newVotingDelay) external {
        //     require(msg.sender == admin, "GovernorBravo::_setVotingDelay: admin only");
        //     require(newVotingDelay >= MIN_VOTING_DELAY && newVotingDelay <= MAX_VOTING_DELAY, "GovernorBravo::_setVotingDelay: invalid voting delay");
        //     uint oldVotingDelay = votingDelay;
        //     votingDelay = newVotingDelay;

        //     emit VotingDelaySet(oldVotingDelay,votingDelay);
        // }

    // TODO: delete _setVotingPeriod
    /**
      * @notice Admin function for setting the voting period
      * @param newVotingPeriod new voting period, in blocks
      */
        // function _setVotingPeriod(uint newVotingPeriod) external {
        //     require(msg.sender == admin, "GovernorBravo::_setVotingPeriod: admin only");
        //     require(newVotingPeriod >= MIN_VOTING_PERIOD && newVotingPeriod <= MAX_VOTING_PERIOD, "GovernorBravo::_setVotingPeriod: invalid voting period");
        //     uint oldVotingPeriod = votingPeriod;
        //     votingPeriod = newVotingPeriod;

        //     emit VotingPeriodSet(oldVotingPeriod, votingPeriod);
        // }

    // TODO: delete _setProposalThreshold
    /**
      * @notice Admin function for setting the proposal threshold
      * @dev newProposalThreshold must be greater than the hardcoded min
      * @param newProposalThreshold new proposal threshold
      */
        // function _setProposalThreshold(uint newProposalThreshold) external {
        //     require(msg.sender == admin, "GovernorBravo::_setProposalThreshold: admin only");
        //     require(newProposalThreshold >= MIN_PROPOSAL_THRESHOLD && newProposalThreshold <= MAX_PROPOSAL_THRESHOLD, "GovernorBravo::_setProposalThreshold: invalid proposal threshold");
        //     uint oldProposalThreshold = proposalThreshold;
        //     proposalThreshold = newProposalThreshold;

        //     emit ProposalThresholdSet(oldProposalThreshold, proposalThreshold);
        // }

    // TODO: delete _setWhitelistAccountExpiration
    /**
     * @notice Admin function for setting the whitelist expiration as a timestamp for an account. Whitelist status allows accounts to propose without meeting threshold
     * @param account Account address to set whitelist expiration for
     * @param expiration Expiration for account whitelist status as timestamp (if now < expiration, whitelisted)
     */
        // function _setWhitelistAccountExpiration(address account, uint expiration) external {
        //     require(msg.sender == admin || msg.sender == whitelistGuardian, "GovernorBravo::_setWhitelistAccountExpiration: admin only");
        //     whitelistAccountExpirations[account] = expiration;

        //     emit WhitelistAccountExpirationSet(account, expiration);
        // }

    // TODO: delete _setWhitelistGuardian
    /**
     * @notice Admin function for setting the whitelistGuardian. WhitelistGuardian can cancel proposals from whitelisted addresses
     * @param account Account to set whitelistGuardian to (0x0 to remove whitelistGuardian)
     */
        // function _setWhitelistGuardian(address account) external {
        //     require(msg.sender == admin, "GovernorBravo::_setWhitelistGuardian: admin only");
        //     address oldGuardian = whitelistGuardian;
        //     whitelistGuardian = account;

        //     emit WhitelistGuardianSet(oldGuardian, whitelistGuardian);
        // }

    // TODO: delete _initiate; don't think we need this right?
    /**
      * @notice Initiate the GovernorBravo contract
      * @dev Admin only. Sets initial proposal id which initiates the contract, ensuring a continuous proposal id count
      * @param governorAlpha The address for the Governor to continue the proposal id count from
      */
      function _initiate(address governorAlpha) external {
          require(msg.sender == admin, "GovernorBravo::_initiate: admin only");
          require(initialProposalId == 0, "GovernorBravo::_initiate: can only initiate once");
          proposalCount = GovernorAlpha(governorAlpha).proposalCount();
          initialProposalId = proposalCount;
          timelock.acceptAdmin();
      }

    /**
      * @notice Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
      * @dev Admin function to begin change of admin. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
      * @param newPendingAdmin New pending admin.
      */
    function _setPendingAdmin(address newPendingAdmin) external {
        // Check caller = admin
        require(msg.sender == admin, "GovernorBravo:_setPendingAdmin: admin only");

        // Save current value, if any, for inclusion in log
        address oldPendingAdmin = pendingAdmin;

        // Store pendingAdmin with value newPendingAdmin
        pendingAdmin = newPendingAdmin;

        // Emit NewPendingAdmin(oldPendingAdmin, newPendingAdmin)
        emit NewPendingAdmin(oldPendingAdmin, newPendingAdmin);
    }

    /**
      * @notice Accepts transfer of admin rights. msg.sender must be pendingAdmin
      * @dev Admin function for pending admin to accept role and update admin
      */
    function _acceptAdmin() external {
        // Check caller is pendingAdmin and pendingAdmin ≠ address(0)
        require(msg.sender == pendingAdmin && msg.sender != address(0), "GovernorBravo:_acceptAdmin: pending admin only");

        // Save current values for inclusion in log
        address oldAdmin = admin;
        address oldPendingAdmin = pendingAdmin;

        // Store admin with value pendingAdmin
        admin = pendingAdmin;

        // Clear the pending value
        pendingAdmin = address(0);

        emit NewAdmin(oldAdmin, admin);
        emit NewPendingAdmin(oldPendingAdmin, pendingAdmin);
    }

    function add256(uint256 a, uint256 b) internal pure returns (uint) {
        uint c = a + b;
        require(c >= a, "addition overflow");
        return c;
    }

    function sub256(uint256 a, uint256 b) internal pure returns (uint) {
        require(b <= a, "subtraction underflow");
        return a - b;
    }

    function getChainIdInternal() internal pure returns (uint) {
        uint chainId;
        assembly { chainId := chainid() }
        return chainId;
    }
}