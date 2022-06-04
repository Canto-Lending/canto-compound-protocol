pragma solidity ^0.5.16;


import "./Note.sol";
import "./CToken.sol";
import "./CNote.sol";
import "./ComptrollerInterface.sol";
import "./Treasury.sol";
import "./Exponential.sol";
import "./ErrorReporter.sol";


contract Accountant is Exponential, TokenErrorReporter{
    
    Note _note;
    cNote _LendingMarket;
    Treasury _Treasury;
    mapping(address => uint) private borrowBalances;
	
    constructor(address  NoteAddress, address  LendingMarketAddr, address   Treasury_) public  {
	//require that the addresses passed are not trivial
	require(LendingMarketAddr != address(0));
	require(Treasury_ != address(0));

	//initialise both the note and cNote Lending Markets
	_note = Note(NoteAddress);
	_LendingMarket = cNote(LendingMarketAddr);
	
	//Enter Accountant into the Note Lending Markets
	ComptrollerInterface comp = ComptrollerInterface(_LendingMarket.comptroller());
	address[] memory MarketEntered = new address[](1);
	MarketEntered[0] = address(_LendingMarket);
	
	uint[] memory err = comp.enterMarkets(MarketEntered);
	require(err[0] == 0);

	//approve Lending Market to send as much Note to itself as it requires
	_note.approve(LendingMarketAddr, uint(-1));
    }


    //ensure that only the cNote Lending Market has the ability to redeem and supply the Note Lending Market
    modifier OnlyLM {
	require(msg.sender == address(_LendingMarket));
	_;
    }

    function viewBalance(address   borrower) view external returns(uint) {
	return borrowBalances[borrower];
    }

    //called when user borrows from lendingmarket
    
    function supplyMarket(uint amount, address   borrower) external OnlyLM returns(uint) {
	borrowBalances[borrower] += amount;
	uint err =  _LendingMarket.mint(amount);
	return err;
     }

    //redeem amount of Note in cNote, must determint how much cNote for amount Note at exchange rate, #cNote = Note * expRate
    
    function redeemMarket(uint amount, address   minter) external OnlyLM returns(uint) {
	//
	borrowBalances[minter] -= amount;

	Exp memory exp_rate = Exp({mantissa: _LendingMarket.exchangeRateStored()});
	(MathError err, Exp memory amtToRedeem) = mulScalar(exp_rate, amount);
	//fail gracefully if there is an error
        if (err != MathError.NO_ERROR) {
            return failOpaque(Error.MATH_ERROR, FailureInfo.BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED, uint(err));
        }
	//redeem the amount of Note calculated via current cNote -> Note exchange rate
	return _LendingMarket.redeem(amtToRedeem.mantissa);
    }

    function sweepInterest() external returns(uint) {
	//get balance(this) of note and cNote
	uint noteBalance = _note.balanceOf(address(this));
	uint cNoteBalance = _LendingMarket.balanceOfUnderlying(address(this));
	//Exp memory exp_rate = Exp({mantissa: _LendingMarket.exchangeRateStored()});
	uint exp_rate = _LendingMarket.exchangeRateStored();
	MathError mathErr;
	(mathErr, cNoteBalance) = divUInt(exp_rate, cNoteBalance);
	if (mathErr != MathError.NO_ERROR) {
            return failOpaque(Error.MATH_ERROR, FailureInfo.BORROW_NEW_ACCOUNT_BORROW_BALANCE_CALCULATION_FAILED, uint(mathErr));
	}
	uint res;
	uint amtToSweep;
	//cannot underflow, subtraction first to prevent against overflow
	(mathErr, res)= subUInt(_note._initialSupply(), noteBalance);
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
