const { ethers } = require('hardhat');

const NoteAbi = [
    "function RetAccountant() public view returns(addres)"
];

const ComptrollerAbi = [
    "function enterMarkets(address[] memory) returns (uint[] memory)", 
    "function _setPriceOracle(address) public returns(uint)"
];


const args = {
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
};



const UniGovAddr = "0x30E20d0A642ADB85Cb6E9da8fB9e3aadB0F593C0";

async function main() {
    const [deployer] = await ethers.getSigners();
    
    const Unitroller = await ethers.getContractFactory("Unitroller");
    const Comptroller = await ethers.getContractFactory("Comptroller");
    const InterestRate = await ethers.getContractFactory("JumpRateModel");
    const PriceOracle = await ethers.getContractFactory("SimplePriceOracle");
    const WCanto =  await ethers.getContractFactory("WCanto");
    const Note = await ethers.getContractFactory("Note");
    const Treasury = await ethers.getContractFactory("Treasury");
    const CNote = await ethers.getContractFactory("cNote");
    const Delegator = await ethers.getContractFactory("CErc20Delegator");
    const CCanto = await ethers.getContractFactory("CEther");
    const Accountant = await ethers.getContractFactory("Accountant");

    
    const CErc20 = await ethers.getContractFactory("CErc20");
    try{
	const unitroller = await Unitroller.deploy();
	console.log("Unitroller: ", unitroller.address);
	const comptroller = await Comptroller.deploy();
	console.log("Comptroller: ",comptroller.address)
	const interestRate = await InterestRate.deploy(1,1,1,1);
	console.log("Jump Rate: ", interestRate.address);
	const priceOracle = await PriceOracle.deploy();
	console.log("Price Oracle: ", priceOracle.address);
	const wcanto = await WCanto.deploy("wCanto", "WCANTO");
	console.log("WCanto: ", wcanto.address);
	const note = await Note.deploy("Note", "NOTE", 10000000);
	console.log("Note: ", note.address);

	note.deployTransaction.wait();

	console.log(Accountant.getDeployTransaction());
	// const treasury = await Treasury.deploy(UniGovAddr, note.address, {gasLimit: 200000});
	// console.log("Treasury: ", treasury.address);
	// const cnote = await CNote.deploy(note.address,
	// 				comptroller.address,
	// 				interestRate.address ,
	// 				args.initialExchangeRateMantissa,
	// 				args.cToken,
	// 				args.symbol,
	// 				args.decimals,
	// 				deployer.address,
	// 				{gasLimit: 500000}
	// 				);
	
	// console.log("cNote: ", cnote.address);
	// const delegator = await Delegator.deploy(
	//     note.address,
	//     comptroller.address,
	//     interestRate.address,
	//     args.initialExchangeRateMantissa,
	//     args.cToken,
	//     args.symbol,
	//     args.decimals,
	//     unitroller.address,
	//     cnote.address,
	//     [],
	//     {gasLimit: 300000}
	// );
	// console.log("Delegator: ", delegator.address);
    } catch(err) {
	console.log(err );
    }
}



main()
  .then(() => process.exit(0)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }));
