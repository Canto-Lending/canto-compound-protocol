async function main () {
    const cTokenDeployArgs = [
	{
	    cToken: 'cNote',
	    symbol: 'cnote',
	    type: 'CErc20',
	    underlying: "0xCA4309f90ff1eE6e99B349Fce8A0259f0Dd407ad",
	    decimals: 18,
	    underlyingPrice: '25022748000000000000',
	    collateralFactor: '800000000000000000',
	    initialExchangeRateMantissa: '200000000000000000000000000',
	    interestRateModel: {
		//address: interestRateModelAddressMapping['Base200bps_Slope1000bps'],
		baseRatePerYear: '20000000000000000',
		multiplierPerYear: '300000000000000000',
	    },
	    admin: "0x7CA9513bF019AD06b11Af9063bcF483318fFC386"
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
		//address: interestRateModelAddressMapping['Base200bps_Slope1000bps'],
		baseRatePerYear: '20000000000000000',
		multiplierPerYear: '300000000000000000',
	    },
	    admin: "0x7CA9513bF019AD06b11Af9063bcF483318fFC386"
	}
    ];
    var cTokens = [];
    let cErc20Factory;
    console.log('Starting to deploy CTokens');
    for (let args of cTokenDeployArgs) {
	if (args.type == 'CErc20') {
	    //let cErc20Factory;
	    if (args.cToken == 'cNote') {
		cErc20Factory = await ethers.getContractFactory('cNote');
	    } else {
		cErc20Factory = await ethers.getContractFactory('CErc20Immutable');
	    }
	    console.log(cErc20Factory);
	    
	    const Contract = await cErc20Factory.deploy(
		args.underlying,
		"0x51A32cCce8b454fa0ca8eF403639C92a3E13Db3d",
		"0xeB2ce0961Cf8e90E315177DBBa003e65FD84B8b2",
		args.initialExchangeRateMantissa,
		args.cToken,
		args.symbol,
		args.decimals,
		args.admin,
		{ gasLimit: 1000000 }
	    );
	    cTokens.push(Contract.address);
	    // TODO: add suport for CErc20Delegators
	    console.log(`Deployed ${args.cToken} (CErc20) at : `, Contract.address);

	    //await Contract.deployTransaction.wait(); 
	    
	    const cERC20DelegatorFactory = await ethers.getContractFactory("CErc20Delegator");
	    const cERC20DelegatorContract = await cERC20DelegatorFactory.deploy(
		args.underlying,
		"0x51A32cCce8b454fa0ca8eF403639C92a3E13Db3d",
		"0xeB2ce0961Cf8e90E315177DBBa003e65FD84B8b2",
		args.initialExchangeRateMantissa,
		args.cToken,
		args.symbol,
		args.decimals,
		args.admin,
		Contract.address,
		[],//currently unused
		{gasLimit: 4000000}
 	    );
	    
	    cTokens.push(Contract.address);
	    console.log("cErc20Delegator deployed: ", cERC20DelegatorContract.address);
	    
	} else if (args.type == 'CEther') {
	    const cEtherFactory = await ethers.getContractFactory('CEther');
	    const Contract = await cEtherFactory.deploy(
		"0x4947d0C3A49050Cc65Be1889624E8D9090bb4f4c",
		"0x2AE05e912A0AA8A8db874246b30eAc42fE697c8F",
		args.initialExchangeRateMantissa,
		args.cToken,
		args.symbol,
		args.decimals,
		args.admin,
		{ gasLimit: 1000000 }
	    );
	    
	    cTokens.push(Contract.address);
	    console.log(`Deployed ${args.cToken} (CEther) at : `, Contract.address);
	}


	//await Contract.deployTransaction.wait();
    }
    console.log("Finished deploying all CTokens.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
	console.error(error);
	process.exit(1);
    });
