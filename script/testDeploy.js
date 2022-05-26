const { ethers } = require('hardhat');


async function main() {
    const [deployer] = await ethers.getSigners();

    const comptrollerFactory = await ethers.getContractFactory("Comptroller");
    const comptrollerContract = await comptrollerFactory.deploy();
    console.log('#1 Comptroller Deployed at: ', comptrollerContract.address);

    
    const config = {
	name: 'Base200bps_Slope1000bps',
	type: 'WhitePaperInterestRateModel',
	args: {
	    baseRatePerYear: '20000000000000000',
	    multiplierPerYear: '100000000000000000',
	}
    };


    
    const whitePaperInterestRateModelFactory = await ethers.getContractFactory('WhitePaperInterestRateModel');
    const whitePaperInterestRateModelContract = await whitePaperInterestRateModelFactory.deploy(config.args.baseRatePerYear, config.args.multiplierPerYear);
    
    const FIJIFactory  = await ethers.getContractFactory('ERC20');
    const FIJIcontract = await FIJIcontract.deploy(
	"FIJI",
	"FIJI",
	100000,
    );
    console.log('FIJI token deployed: ', FIJIcontract.address)
    
    
    const cFIJI =
	  {
	    cToken: 'cFIJI',
	    symbol: 'cFIJI',
	    type: 'CErc20',
	    underlying: FIJIcontract.address,
	    decimals: 18,
	    underlyingPrice: '25022748000000000000',
	    collateralFactor: '800000000000000000',
	    initialExchangeRateMantissa: '200000000000000000000000000',
	    interestRateModel: {
		address: whitePaperInterestRateModelContract
	    },
	    admin: deployer.address
	  };
    const cErc20Factory = await ethers.getContractFactory('CErc20Immutable');
    const cErc20Contract = await cErc20Factory.deploy(
        cFIJI.underlying,
        comptrollerContract.address,
        cFIJI.interestRateModel.address,
        cFIJI.initialExchangeRateMantissa,
        cFIJI.cToken,
        cFIJI.symbol,
        cFIJI.decimals,
        cFIJI.admin,
        { gasLimit: 1000000 }
    );
    
    
    console.log('Finished deploying cFIJI token: ', cErc20Contract.address);
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
