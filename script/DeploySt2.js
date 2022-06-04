const { ethers } = require("hardhat");
// TODO: remove FIJI, EVIAN, and AQUA tokens after testing

const RESERVOIR_DRIP_RATE = '6944444444000000';


const NoteAbi = [
    "function _setAccountantAddress(address) external",
    "function _mint_to_Accounting() public"
];

const UniGovAddr = "0x30E20d0A642ADB85Cb6E9da8fB9e3aadB0F593C0";

async function main() {
    const tokenArgs = [
	{
	    name: "Note",
	    symbol: "note",
	    // decimals: 1,
	    initialSupply:  10000000000000000000000000000000 
	},
	{
	    name: "wCanto",
	    symbol: "wCanto",
	    // decimals: 1,
	},
    ];

    let Contract;
    //deploying Tokens, 
    var underlyingTokens = {};
    for (let args of tokenArgs) {
	if (args.name == "wCanto")  {
	    const wCantoFactory = await ethers.getContractFactory("WCanto");
	    const  Contract = await wCantoFactory.deploy(
		args.name,
		args.symbol
	    );

	    await Contract.deployTransaction.wait();
	    console.log(`Deployed ${args.name} to: `, Contract.address);
	    
	    underlyingTokens[args.name] = Contract;
	} else if (args.name == "Note") {
	    const noteFactory = await ethers.getContractFactory("Note");
	    const Contract = await noteFactory.deploy(
		"note",
		"Note",
		10000000000,
	    );
	    
	    await Contract.deployTransaction.wait();
	    console.log("Note deployed to: ", Contract.address);
	    underlyingTokens[args.name] = Contract;
	} else {
	    const tokenFactory = await ethers.getContractFactory('ERC20');
	    const Contract = await tokenFactory.deploy(
		args.name,
		args.symbol,
		// args.decimals,
		args.initialSupply
	    );
	    
	    await Contract.deployTransaction.wait();
	    console.log(`Deployed ${args.name} to: `, Contract.address);
	    underlyingTokens[args.name] = Contract;
	}
    }
    
    const TreasuryFactory = await ethers.getContractFactory("Treasury");
    const treasury = await TreasuryFactory.deploy(UniGovAddr, underlyingTokens["Note"].address, {gasLimit: 200000000});
    
    console.log("treasury deployed to: ", treasury.address);
    
    const cTokenDeployArgs = [
	{
	    cToken: 'cNote',
	    symbol: 'cnote',
	    type: 'CErc20',
	    underlying: underlyingTokens['Note'].address,
	    decimals: 18,
	    underlyingPrice: '25022748000000000000',
	    collateralFactor: '800000000000000000',
	    initialExchangeRateMantissa: '200000000000000000000000000',
	    interestRateModel: {
		//address: interestRateModelAddressMapping['Base200bps_Slope1000bps'],
		address: "0x7527959091dF705Cc37caE03b6B78709e1aFfF44",
		baseRatePerYear: '20000000000000000',
		multiplierPerYear: '300000000000000000',
	    },
	    admin: "0xef39A742eeCf3785d2Acd429cADbc5a182867D04"
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
		address:"0x7527959091dF705Cc37caE03b6B78709e1aFfF44",
		baseRatePerYear: '20000000000000000',
		multiplierPerYear: '300000000000000000',
	    },
	    admin: "0xef39A742eeCf3785d2Acd429cADbc5a182867D04"
	}
    ];
    var cTokens = [];
    
    console.log('Starting to deploy CTokens');
    for (let args of cTokenDeployArgs) {
	if (args.type == 'CErc20') {
	    let cErc20Factory;
	    if (args.cToken == 'cNote') {
		cErc20Factory = await ethers.getContractFactory('cNote');
	    } else {
		 cErc20Factory = await ethers.getContractFactory('CErc20Immutable');
	    }

	    const Contract = await cErc20Factory.deploy(
		args.underlying,
		// comptrollerContract.address,
		"0x74CB70A979BdBDd5f412DbD5a171e688Dbaed9bC",
		args.interestRateModel.address,
		args.initialExchangeRateMantissa,
		args.cToken,
		args.symbol,
		args.decimals,
		args.admin,
		{ gasLimit: 1000000 }
	    );
	    // TODO: add suport for CErc20Delegators
	    console.log(`Deployed ${args.cToken} (CErc20) at : `, Contract.address);

	    await Contract.deployTransaction.wait(); 


	    cTokens.push(Contract.address);
	    
	    const cERC20DelegatorFactory = await ethers.getContractFactory("CErc20Delegator");
	    const cERC20DelegatorContract = await cERC20DelegatorFactory.deploy(
		args.underlying,
		//comptrollerContract.address,
		"0x74CB70A979BdBDd5f412DbD5a171e688Dbaed9bC",
		args.interestRateModel.address,
		args.initialExchangeRateMantissa,
		args.cToken,
		args.symbol,
		args.decimals,
		args.admin,
		Contract.address,
		[],//currently unused
		{gasLimit: 4000000}
 	    );
	    
	    Console.log("cErc20Delegator deployed: ", cERC20DelegatorContract.address);
	    
	} else if (args.type == 'CEther') {
	    const cEtherFactory = await ethers.getContractFactory('CEther');
	    const Contract = await cEtherFactory.deploy(
		// comptrollerContract.address,
		"0x74CB70A979BdBDd5f412DbD5a171e688Dbaed9bC",
		args.interestRateModel.address,
		args.initialExchangeRateMantissa,
		args.cToken,
		args.symbol,
		args.decimals,
		args.admin,
		{ gasLimit: 1000000 }
	    );
	    console.log(`Deployed ${args.cToken} (CEther) at : `, Contract.address);
	    
	    await Contract.deployTransaction.wait(); 

	    cTokens.push(Contract.address);
	}

    }
    console.log("Finished deploying all CTokens.");

    const AccountantFactory = await ethers.getContractFactory("Accountant");
    const AccountantContract = await AccountantFactory.deploy(
	underlyingTokens["Note"].address,
	cTokens[0],
	treasury.address,
	{gasLimit: 200000}
    );


    await AccountantContract.deployTransaction.wait();
    const AccountantSet  = await (await ethers.getContractAt(NoteAbi,
							     underlyingTokens["Note"].address,
							     deployer))._setAccountantAddress(AccountantContract.address);

    console.log("Accountant deployed: ", AccountantContract.address );
    
    const ComptrollerLensFactory = await ethers.getContractFactory("CompoundLens");
    const CompoundLens = await ComptrollerLensFactory.deploy();

    console.log("Comptroller Lens deployed: ", CompoundLens.address);i
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
	console.error(error);
	process.exit(1);
    });
