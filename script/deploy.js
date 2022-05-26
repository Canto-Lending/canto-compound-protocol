const { ethers } = require("hardhat");

// TODO: remove FIJI, EVIAN, and AQUA tokens after testing

const RESERVOIR_DRIP_RATE = '6944444444000000';

const INTEREST_RATE_MODEL = {
    Base200bps_Slope1000bps: {
	name: 'Base200bps_Slope1000bps',
	type: 'WhitePaperInterestRateModel',
	args: {
	    baseRatePerYear: '20000000000000000',
	    multiplierPerYear: '100000000000000000',
	},
    },
    Base200bps_Slope3000bps: {
	name: 'Base200bps_Slope3000bps',
	type: 'WhitePaperInterestRateModel',
	args: {
	    baseRatePerYear: '20000000000000000',
	    multiplierPerYear: '300000000000000000',
	},
    },
    Base500bps_Slope1200bps: {
	name: 'Base500bps_Slope1200bps',
	type: 'WhitePaperInterestRateModel',
	args: {
	    baseRatePerYear: '50000000000000000',
	    multiplierPerYear: '120000000000000000',
    },
  },
    IRM_COMP_Updateable: {
      name: 'IRM_COMP_Updateable',
      type: 'JumpRateModelV2',
      args: {
	  baseRatePerYear: '20000000000000000',
	  multiplierPerYear: '180000000000000000',
	  jumpMultiplierPerYear: '4000000000000000000',
	  kink: '800000000000000000',
	  owner: '0x00',
    },
  },
    IRM_UNI_Updateable: {
      name: 'IRM_UNI_Updateable',
      type: 'JumpRateModelV2',
      args: {
      baseRatePerYear: '20000000000000000',
	multiplierPerYear: '180000000000000000',
	jumpMultiplierPerYear: '4000000000000000000',
	kink: '800000000000000000',
	owner: '0x00',
    },
  },
    IRM_USDC_Updateable: {
      name: 'IRM_USDC_Updateable',
      type: 'LegacyJumpRateModelV2',
      args: {
	baseRatePerYear: '0',
	multiplierPerYear: '40000000000000000',
	jumpMultiplierPerYear: '1090000000000000000',
	kink: '800000000000000000',
	owner: '0x00',
    },
  },
    IRM_USDT_Updateable: {
    name: 'IRM_USDT_Updateable',
    type: 'JumpRateModelV2',
      args: {
	  baseRatePerYear: '0',
	  multiplierPerYear: '40000000000000000',
	  jumpMultiplierPerYear: '1090000000000000000',
	  kink: '800000000000000000',
	  owner: '0x00',
      },
    },
    wbtc2_irm: {
	name: 'wbtc2_irm',
	type: 'JumpRateModelV2',
	args: {
	    baseRatePerYear: '20000000000000000',
	    multiplierPerYear: '180000000000000000',
	    jumpMultiplierPerYear: '1000000000000000000',
	    kink: '800000000000000000',
	    owner: '0x00',
	},
    },
};

async function main() {
    const [deployer] = await ethers.getSigners();
    
    const comptrollerFactory = await ethers.getContractFactory("Comptroller");
    const comptrollerContract = await comptrollerFactory.deploy();
    console.log('#1 Comptroller Deployed at: ', comptrollerContract.address);

    const unitrollerFactory = await ethers.getContractFactory("Unitroller");
    const unitrollerContract = await unitrollerFactory.deploy();
    console.log('#2 Unitroller Deployed at: ', unitrollerContract.address);
    
    const setPendingImpTx = await unitrollerContract._setPendingImplementation(comptrollerContract.address);
    console.log("#3 Set unitroller implementation to :", comptrollerContract.address);
    
    const acceptImpTx = await unitrollerContract.connect(comptrollerContract.signer)._acceptImplementation();
    console.log("#4 Accepted Unitroller implementation for: ", comptrollerContract.address);
    
    //deploy a placeholder erc20token contract, this token represents the WrappedCanto interface

    const ERC20TokenFactory = await ethers.getContractFactory("ERC20");
    const ERC20TokenContract = await ERC20TokenFactory.deploy("Token", "Token", 10000);

    console.log("ERC20 sample token deployed: ", ERC20TokenContract.address)
    
    const reservoirFactory = await ethers.getContractFactory("Reservoir");
    const reservoirContract = await reservoirFactory.deploy(RESERVOIR_DRIP_RATE, ERC20TokenContract.address, unitrollerContract.address);
    console.log("#5 Reservoir deployed at: ", reservoirContract.address);

  // TODO: set reservoir drip target

    const priceOracleFactory = await ethers.getContractFactory("SimplePriceOracle");
    const priceOracleContract = await priceOracleFactory.deploy();
    console.log("#6 Price Oracle deployed at: ", priceOracleContract.address);
    
    await comptrollerContract._setPriceOracle(priceOracleContract.address);
    console.log('#7 Set price oracle for comptroller to: ', priceOracleContract.address);

    console.log("Starting to deploy interest rate models.");
    
    var interestRateModelAddressMapping = {};
    
    const interestRateModelConfigs = Object.values(INTEREST_RATE_MODEL);
    for (const config of interestRateModelConfigs) {
	var currInterestRateModelAddress;
	if ('owner' in config.args) {
	    config.args.owner = deployer.address;
	}
	if (config.type == 'WhitePaperInterestRateModel') {
	    const whitePaperInterestRateModelFactory = await ethers.getContractFactory('WhitePaperInterestRateModel');
	    const whitePaperInterestRateModelContract = await whitePaperInterestRateModelFactory.deploy(config.args.baseRatePerYear, config.args.multiplierPerYear);
	    currInterestRateModelAddress = whitePaperInterestRateModelContract.address;
	} else if (config.type == 'LegacyJumpRateModelV2') {
	    const legacyJumpRateModelV2Factory = await ethers.getContractFactory("LegacyJumpRateModelV2");
	    const legacyJumpRateModelV2Contract = await legacyJumpRateModelV2Factory.deploy(config.args.baseRatePerYear, config.args.multiplierPerYear, config.args.jumpMultiplierPerYear, config.args.kink, config.args.owner);
      currInterestRateModelAddress = legacyJumpRateModelV2Contract.address;
	} else {
	    const jumpRateModelV2Factory = await ethers.getContractFactory('JumpRateModelV2');
	    const jumpRateModelV2Contract = await jumpRateModelV2Factory.deploy(config.args.baseRatePerYear, config.args.multiplierPerYear, config.args.jumpMultiplierPerYear, config.args.kink, config.args.owner);
      currInterestRateModelAddress = jumpRateModelV2Contract.address;
	}
	interestRateModelAddressMapping[config.name] = currInterestRateModelAddress;
	console.log(`Deployed ${config.name} to: `, currInterestRateModelAddress);
    }
    console.log("Finished deploying all interest rate models. ", interestRateModelAddressMapping);

    const tokenArgs = [
	{
	    name: "FIJI",
	    symbol: "FIJI",
	    // decimals: 1,
	    initialSupply: 100000
	},
	{
	    name: "AQUA",
	    symbol: "AQUA",
	    // decimals: 1,
	    initialSupply: 100000
	},
	{
	    name: "EVIAN",
	    symbol: "EVIAN",
	    // decimals: 1,
	    initialSupply: 100000
	}
  ];
    
    var underlyingTokenAddresses = {};
    for (let args of tokenArgs) {
	const testErc20Factory = await ethers.getContractFactory('ERC20');
	const testErc20Contract = await testErc20Factory.deploy(
	    args.name,
	    args.symbol,
	    // args.decimals,
	    args.initialSupply
	);
	underlyingTokenAddresses[args.name] = testErc20Contract.address;
	console.log(`Deployed ${args.name} to: `, testErc20Contract.address);
    }
    
    const cTokenDeployArgs = [
	{
	    cToken: 'cFIJI',
	    symbol: 'cFIJI',
	    type: 'CErc20',
	    underlying: underlyingTokenAddresses['FIJI'],
	    decimals: 18,
	    underlyingPrice: '25022748000000000000',
	    collateralFactor: '800000000000000000',
	    initialExchangeRateMantissa: '200000000000000000000000000',
	    interestRateModel: {
		address: interestRateModelAddressMapping['Base200bps_Slope1000bps']
	    },
	    admin: deployer.address
	},
	{
	    cToken: 'cEVIAN',
	    symbol: 'cEVIAN',
	    type: 'CErc20',
	    underlying: underlyingTokenAddresses['EVIAN'],
	    decimals: 18,
	    underlyingPrice: '25022748000000000000',
	    collateralFactor: '800000000000000000',
	    initialExchangeRateMantissa: '200000000000000000000000000',
	    interestRateModel: {
		address: interestRateModelAddressMapping['Base200bps_Slope1000bps'],
		baseRatePerYear: '20000000000000000',
		multiplierPerYear: '300000000000000000',
	    },
	    admin: deployer.address
	},
    {
	cToken: 'cAQUA',
	symbol: 'cAQUA',
	type: 'CErc20',
	underlying: underlyingTokenAddresses['AQUA'],
	decimals: 18,
	underlyingPrice: '25022748000000000000',
	collateralFactor: '800000000000000000',
	initialExchangeRateMantissa: '200000000000000000000000000',
	interestRateModel: {
            address: interestRateModelAddressMapping['Base200bps_Slope1000bps'],
            baseRatePerYear: '20000000000000000',
            multiplierPerYear: '300000000000000000',
      },
      admin: deployer.address
    },
    {
      cToken: 'cCANTO',
      symbol: 'cCANTO',
      type: 'CEther',
      decimals: 18,
      underlyingPrice: '35721743800000000000000',
      collateralFactor: '600000000000000000',
      initialExchangeRateMantissa: '200000000000000000000000000',
      interestRateModel: {
        address: interestRateModelAddressMapping['Base200bps_Slope1000bps'],
        baseRatePerYear: '20000000000000000',
        multiplierPerYear: '300000000000000000',
      },
      admin: deployer.address
    }
  ];

  console.log('Starting to deploy CTokens');
  for (let args of cTokenDeployArgs) {
    if (args.type == 'CErc20') {
      const cErc20Factory = await ethers.getContractFactory('CErc20Immutable');
      const cErc20Contract = await cErc20Factory.deploy(
        args.underlying,
        comptrollerContract.address,
        args.interestRateModel.address,
        args.initialExchangeRateMantissa,
        args.cToken,
        args.symbol,
        args.decimals,
        args.admin,
        { gasLimit: 1000000 }
      );
      // TODO: add suport for CErc20Delegators
      console.log(`Deployed ${args.cToken} (CErc20) at : `, cErc20Contract.address);
    } else if (args.type == 'CEther') {
      const cEtherFactory = await ethers.getContractFactory('CEther');
      const cEtherContract = await cEtherFactory.deploy(
        comptrollerContract.address,
        args.interestRateModel.address,
        args.initialExchangeRateMantissa,
        args.cToken,
        args.symbol,
        args.decimals,
        args.admin,
        { gasLimit: 1000000 }
      );
      console.log(`Deployed ${args.cToken} (CEther) at : `, cEtherContract.address);
    }
  }
  console.log('Finished deploying all CTokens.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
