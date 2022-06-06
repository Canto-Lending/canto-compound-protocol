pragma solidity ^0.5.16;


import "./EIP20Interface.sol";
import "./CToken.sol";
import "./cNote.sol";
import "./ComptrollerInterface.sol";
import "./Treasury.sol";
import "./Exponential.sol";
import "./ErrorReporter.sol";


contract Accountant is Exponential, TokenErrorReporter{
	
	address private admin;
    EIP20Interface _note;
    cNote _LendingMarket;
    Treasury _Treasury;
    mapping(address => uint) private borrowBalances;
	ComptrollerInterface Comp;


    constructor(address  note_, address LendingMarketAddr, address payable treasury, address comp_) public  {
		//require that the addresses passed are not trivial
		// require(LendingMarketAddr != address(0));
		// require(Treasury_ != address(0));

		//initialise both the note and cNote Lending Markets
		_note = EIP20Interface(note_); 
		_LendingMarket = cNote(LendingMarketAddr);
		_Treasury = Treasury(treasury);
		Comp  = ComptrollerInterface(comp_);
		admin = msg.sender;
    }

	function initialize() external {
		//Enter Accountant into the Note Lending Markets
		require(msg.sender == admin);
		//ComptrollerInterface comp = ComptrollerInterface(_LendingMarket.comptroller());
		address[] memory MarketEntered = new address[](1);
		MarketEntered[0] = address(_LendingMarket);
		
		uint[] memory err = Comp.enterMarkets(MarketEntered);
		require(err[0] == 0);

		//approve Lending Market to send as much Note to itself as it requires
		_note.approve(address(_LendingMarket), uint(-1));
	}

    function viewBalance(address   borrower) view external returns(uint) {
		return borrowBalances[borrower];
    }

    // //called when user borrows from lendingmarket
    
    function supplyMarket(uint amount, address   borrower) external returns(uint) {
		require(msg.sender == address(_LendingMarket));
		borrowBalances[borrower] += amount;
		uint err =  _LendingMarket.mint(amount);
		return err;
     }

    // //redeem amount of Note in cNote, must determint how much cNote for amount Note at exchange rate, #cNote = Note * expRate
    
    function redeemMarket(uint amount, address   minter) external returns(uint) {	
		borrowBalances[minter] -= amount;

		uint exp_rate = _LendingMarket.exchangeRateStored();
		(MathError err, uint amtToRedeem) = mulUInt(exp_rate, amount);
		//fail gracefully if there is an error
			if (err != MathError.NO_ERROR) {
				return failOpaque(Error.MATH_ERROR, FailureInfo.BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED, uint(err));
			}
		//redeem the amount of Note calculated via current cNote -> Note exchange rate
		return _LendingMarket.redeem(amtToRedeem);
    }

    function sweepInterest() external returns(uint) {
	// 	//get balance(this) of note and cNote
		uint noteBalance = _note.balanceOf(address(this));
		uint cNoteBalance = _LendingMarket.balanceOfUnderlying(address(this));

		uint exp_rate = _LendingMarket.exchangeRateStored();
		MathError mathErr;
		(mathErr, cNoteBalance) = divUInt(exp_rate, cNoteBalance);
		if (mathErr != MathError.NO_ERROR) {
				return failOpaque(Error.MATH_ERROR, FailureInfo.BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED, uint(mathErr));
		}
		uint res;
		uint amtToSweep;
		//cannot underflow, subtraction first to prevent against overflow
		(mathErr, res)= subUInt(_note.totalSupply(), noteBalance);
		if (mathErr != MathError.NO_ERROR) {
			return failOpaque(Error.MATH_ERROR, FailureInfo.BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED, uint(mathErr));
		}

		(mathErr, amtToSweep) = addUInt(res, cNoteBalance);
		if (mathErr != MathError.NO_ERROR) {
				return failOpaque(Error.MATH_ERROR, FailureInfo.BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED, uint(mathErr));
		}
		
		_note.transfer(address(_Treasury), amtToSweep);
		return 0;
    }

    
    //so that address is able to be cast to address payable
    function() external payable {}
}
