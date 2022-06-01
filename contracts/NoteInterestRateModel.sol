pragma solidity ^0.5.16;

import "./InterestRateModel.sol";
import "./SimplePriceOracle.sol";
import "./SafeMath.sol";

/**
  * @title Note's Interest Rate Model Contract
  * @author Canto
  */


contract NoteRateModel is InterestRateModel {
    using SafeMath for uint;

    event NewInterestParams(uint baseRatePerBlock, uint lastUpdateBlock);

    /**
    * @notice Administrator for this contract
    */
    address public admin;

    /**
     * @notice The approximate number of blocks per year that is assumed by the interest rate model
     */
    uint public constant blocksPerYear = 2102400;

    /**
     * @notice baseRatePerYear The approximate target base APR, as a mantissa (scaled by 1e18)
     */
    uint public baseRatePerYear; // set by admin, default 2%

    /**
     * @notice baseRatePerBlock The per block interest rate, as a mantissa (scaled by 1e18)
     */
    uint public baseRatePerBlock;

    /**
     * @notice The level of aggressiveness to adjust interest rate according to twap's deviation from the peg
     */
    uint public adjusterCoefficient; // set by admin, default 1

    /**
     * @notice The frequency of updating Note's base rate
     */
    uint public updateFrequency; // set by admin, default 24 hours

    /**
     * @notice The variable to keep track of the last update on Note's interest rate
     */
    uint public lastUpdateBlock;

    /**
     * @notice The CToken identifier for Note
     */
    CToken public note;

    /// @notice Emitted when base rate is changed by admin
    event NewBaseRate(uint oldBaseRateMantissa, uint newBaseRateMantissa);

    /// @notice Emitted when adjuster coefficient is changed by admin
    event NewAdjusterCoefficient(uint oldAdjusterCoefficient, uint newAdjusterCoefficient);

    /// @notice Emitted when update frequency is changed by admin
    event NewUpdateFrequency(uint oldUpdateFrequency, uint newUpdateFrequency);

    /**
     * @notice Construct an interest rate model
     * The `constructor` is executed only once when the contract is created.
     */
    constructor() public {
        admin = msg.sender;
        lastUpdateBlock = block.number;
        baseRatePerBlock = baseRatePerYear.div(blocksPerYear);
        emit NewInterestParams(baseRatePerBlock, lastUpdateBlock);
    }

    /**
      * @notice Get the underlying price of a cToken asset
      * @param cToken The cToken to get the underlying price of
      * @return The underlying asset price mantissa (scaled by 1e18).
      *  Zero means the price is unavailable.
      */
    function getUnderlyingPrice(CToken cToken) public view returns (uint);

    /**
     * @notice Calculates the current borrow rate per block, with the error code expected by the market
     * @notice The following parameters are irrelevent for calculating Note's interest rate. They are passed in to align with the standard function definition `getBorrowRate` in InterestRateModel
     ---- irrelevent parameters [start] ----
     * @param cash The total amount of cash the market has
     * @param borrows The total amount of borrows the market has outstanding
     * @param reserves The total amount of reserves the market has
     ---- irrelevent parameters [end]   ----
     * @return Note's borrow rate percentage per block as a mantissa (scaled by 1e18)
     */
    function getBorrowRate(uint cash, uint borrows, uint reserves) public view returns (uint) {
        // Gets the Note/gUSDC TWAP in a given interval, as a mantissa (scaled by 1e18)
        uint twapMantissa = getUnderlyingPrice(note);
        uint ir = (1-twapMantissa).mul(adjusterCoefficient).add(baseRatePerYear);
        uint newRatePerYear = ir >= 0 ? ir : 0;
        // convert it to base rate per block
        uint newRatePerBlock = newRatePerYear.div(blocksPerYear);
        return newRatePerBlock;
    }


    /**
     * @notice Calculates the current supply rate per block, which is the same as the borrow rate
     * @notice The following parameters are irrelevent for calculating Note's interest rate. They are passed in to align with the standard function definition `getSupplyRate` in InterestRateModel
     ---- irrelevent parameters [start] ----
     * @param cash The total amount of cash the market has
     * @param borrows The total amount of borrows the market has outstanding
     * @param reserves The total amount of reserves the market has
     * @param reserveFactorMantissa The current reserve factor the market has
     ---- irrelevent parameters [end]   ----
     * @return Note's supply rate percentage per block as a mantissa (scaled by 1e18)
     */
    function getSupplyRate(uint cash, uint borrows, uint reserves, uint reserveFactorMantissa) public view returns (uint) {
      return getBorrowRate(cash, borrows, reserves);
    }

    /**
     * @notice Updates the Note's base rate per year at a given interval
     * @notice This function should be called at a given interval (TBD)
     * @param newBaseRatePerYear The new base rate per year of Note
     */
    function updateBaseRate(uint newBaseRatePerYear) public {
        // check the current block number
        uint blockNumber = block.number;
        uint deltaBlocks = blockNumber.sub(lastUpdateBlock);

        if (deltaBlocks > updateFrequency) {
            // pass in a base rate per year
            baseRatePerYear = newBaseRatePerYear;
            lastUpdateBlock = blockNumber;
            emit NewInterestParams(baseRatePerYear, lastUpdateBlock);
        }
    }


    // Admin functions

    /**
      * @notice Sets the base interest rate for Note
      * @dev Admin function to set per-market base interest rate
      * @param newBaseRateMantissa The new base interest rate, scaled by 1e18
      */
    function _setBaseRatePerYear(uint newBaseRateMantissa) external {
        // Check caller is admin
        require(msg.sender == admin, "only the admin may set the base rate");
        uint oldBaseRatePerYear = baseRatePerYear;
        baseRatePerYear = newBaseRateMantissa;
        emit NewBaseRate(oldBaseRatePerYear, baseRatePerYear);
    }

    /**
      * @notice Sets the adjuster coefficient for Note
      * @dev Admin function to set per-market adjuster coefficient
      * @param newAdjusterCoefficient The new adjuster coefficient, scaled by 1e18
      */
    function _setAdjusterCoefficient(uint newAdjusterCoefficient) external {
        // Check caller is admin
        require(msg.sender == admin, "only the admin may set the adjuster coefficient");
        uint oldAdjusterCoefficient = adjusterCoefficient;
        adjusterCoefficient = newAdjusterCoefficient;
        emit NewAdjusterCoefficient(oldAdjusterCoefficient, adjusterCoefficient);
    }

    /**
      * @notice Sets the update frequency for Note's interest rate
      * @dev Admin function to set the update frequency
      * @param newUpdateFrequency The new update frequency, scaled by 1e18
      */
    function _setUpdateFrequency(uint newUpdateFrequency) external {
        // Check caller is admin
        require(msg.sender == admin, "only the admin may set the update frequency");
        uint oldUpdateFrequency = updateFrequency;
        updateFrequency = newUpdateFrequency;
        emit NewUpdateFrequency(oldUpdateFrequency, updateFrequency);
    }
}
