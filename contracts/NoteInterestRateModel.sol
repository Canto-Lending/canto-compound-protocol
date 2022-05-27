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

    event NewInterestParams(uint baseRatePerBlock);

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
     * @notice Construct an interest rate model
     * The `constructor` is executed only once when the contract is created.
     */
    constructor() public {
        admin = msg.sender;
        uint lastUpdateBlock = block.number;
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
     * @notice Gets the Note/gUSDC TWAP in a given interval
     * @param note The name of the Note stablecoin in the system
     * @return The current TWAP price of Note as a mantissa (scaled by 1e18)
     */
    function getNotePriceOracle(CToken note) public view returns (uint) {
        uint notePrice = getUnderlyingPrice(note);
        return notePrice;
    }

    /**
     * @notice Calculates the current borrow rate per block, with the error code expected by the market
     * @param note The CToken identifier for Note
     * @return Note's borrow rate percentage per block as a mantissa (scaled by 1e18)
     */
    function getNoteBorrowRate(CToken note) public view returns (uint) {
        uint twap = getNotePriceOracle(note);
        uint ir = (1-twap).mul(adjusterCoefficient).add(baseRatePerYear);
        uint newRatePerYear = ir >= 0 ? ir : 0;
        // convert it to base rate per block
        uint newRatePerBlock = newRatePerYear.div(blocksPerYear);
        return newRatePerBlock;
    }

    /**
     * @notice Updates the Note's base rate per year at a given interval
     * @notice This function should be called at a given interval (TBD)
     * @param lastUpdateBlock The frequency of updating Note's base rate
     * @param newBaseRatePerYear The new base rate per year of Note
     */
    function updateContributorRewards(uint updateFrequency, uint newBaseRatePerYear) public {
        // check the current block number
        uint blockNumber = block.number;
        uint deltaBlocks = sub(blockNumber, lastUpdateBlock);

        if (deltaBlocks > updateFrequency) {
            // pass in a base rate per year
            baseRatePerYear = newBaseRatePerYear;
            emit NewInterestParams(baseRatePerYear);
            lastUpdateBlock = blockNumber;
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
        baseRatePerYear = newBaseRateMantissa;
        emit NewInterestParams(baseRatePerYear);
    }

    /**
      * @notice Sets the adjuster coefficient for Note
      * @dev Admin function to set per-market adjuster coefficient
      * @param newAdjusterCoefficient The new adjuster coefficient, scaled by 1e18
      */
    function _setAdjusterCoefficient(uint newAdjusterCoefficient) external {
        // Check caller is admin
        require(msg.sender == admin, "only the admin may set the adjuster coefficient");
        adjusterCoefficient = newAdjusterCoefficient;
        emit NewInterestParams(adjusterCoefficient);
    }

    /**
      * @notice Sets the update frequency for Note's interest rate
      * @dev Admin function to set the update frequency
      * @param newUpdateFrequency The new update frequency, scaled by 1e18
      */
    function _setUpdateFrequency(uint newUpdateFrequency) external {
        // Check caller is admin
        require(msg.sender == admin, "only the admin may set the update frequency");
        updateFrequency = newUpdateFrequency;
        emit NewInterestParams(updateFrequency);
    }
}

/**
 * @question the coefficient 0.014 and 0.2 (some stddev for distribution)?
 * @question what is gUSDC versus USDC
 */