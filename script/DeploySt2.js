//const { ethers } = require("hardhat");
// TODO: remove FIJI, EVIAN, and AQUA tokens after testing

const RESERVOIR_DRIP_RATE = '6944444444000000';


const NoteAbi = [
    "function _setAccountantAddress(address) external",
    "function _mint_to_Accounting() public"
];

const UniGovAddr = "0x30E20d0A642ADB85Cb6E9da8fB9e3aadB0F593C0";


const ir =  {
    name: 'Base500bps_Slope1200bps',
    type: 'WhitePaperInterestRateModel',
    args: {
	baseRatePerYear: '50000000000000000',
	multiplierPerYear: '120000000000000000',
    }
};

async function main() {
    const [deployer] = await ethers.getSigners();
    // const [
    // 	ComptrollerFactory,
    // 	UnitrollerFactory,
    // 	PriceOracleFactory,
    // 	InterestRateFactory,
    // 	wCantoFactory,
    // 	NoteFactory,
    // 	TreasuryFactory,
    // 	cNoteFactory,
    // 	cERC20DelegatorFactory,
    // 	cCantoFactory,
    // 	AccountantFactory,
    // 	CompoundLensFactory,
    // ] = await Promise.all(
    // 	[
    // 	    ethers.getContractFactory("Comptroller"),
    // 	    ethers.getContractFactory("Unitroller"),
    // 	    ethers.getContractFactory("SimplePriceOracle"),
    // 	    ethers.getContractFactory("WhitePaperInterestRateModel"),
    // 	    ethers.getContractFactory("WCanto"),
    // 	    ethers.getContractFactory("Note"),
    // 	    ethers.getContractFactory("Treasury"),
    // 	    ethers.getContractFactory("cNote"),
    // 	    ethers.getContractFactory("CErc20Delegator"),
    // 	    ethers.getContractFactory("CEther"),
    // 	    ethers.getContractFactory("Accountant"),
    // 	    ethers.getContractFactory("CompoundLens")
    // 	]
    // );

    
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
    
    var underlyingTokens = {};
    for (let args of tokenArgs) {
	if (args.name == "wCanto")  {
	    const wCantoFactory = await ethers.getContractFactory("WCanto");
	    const  Contract = await wCantoFactory.deploy(
		args.name,
		args.symbol
	    );

	    //await Contract.deployTransaction.wait();
	    console.log(`Deployed ${args.name} to: `, Contract.address);
	    underlyingTokens[args.name] = Contract;
	} else if (args.name == "Note") {
	    const noteFactory = await ethers.getContractFactory("Note");
	    const Contract = await noteFactory.deploy(
		"note",
		"Note",
		10000000000,
	    );
	    
	    //await Contract.deployTransaction.wait();
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
	    
	    //await Contract.deployTransaction.wait();
	    console.log(`Deployed ${args.name} to: `, Contract.address);
	    
	    underlyingTokens[args.name] = Contract;
	}
    }

    
    // console.log("contract factories obtained");
    
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
	console.error(error);
	process.exit(1);
    });
