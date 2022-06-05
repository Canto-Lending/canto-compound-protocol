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

async function main() {
    const [deployer] = await ethers.getSigners();

    const irFactory = await ethers.getContractFactory('JumpRateModel');
    const ir = await irFactory.deploy(1,1,1,1);


    await ir.deployTransaction.wait();
    console.log(ir.address);
    
    const noteFactory = await ethers.getContractFactory("Note");
    const noteContract = await noteFactory.deploy(
	"note",
	"Note",
	10000000000,
    );

    await noteContract.deployTransaction.wait();
    
    console.log(noteContract.address);
    
    const unitrollerFactory = await ethers.getContractFactory("Unitroller");
    const unitrollerContract = await unitrollerFactory.deploy();

    await unitrollerContract.deployTransaction.wait();
    console.log('#2 Unitroller Deployed at: ', unitrollerContract.address);
    
    const comptrollerFactory = await ethers.getContractFactory("Comptroller");
    const comptrollerContract = await comptrollerFactory.deploy();

    await comptrollerContract.deployTransaction.wait();
    console.log("Comptroller deployed: ", comptrollerContract.address);
    
    const setPendingImpTx = await unitrollerContract._setPendingImplementation(comptrollerContract.address);
    console.log("#3 Set unitroller implementation to :", comptrollerContract.address);

    
    const acceptImpTx = await unitrollerContract.connect(comptrollerContract.signer)._acceptImplementation();
    console.log("#4 Accepted Unitroller implementation for: ", comptrollerContract.address);
    
    //console.log(ethers.getContractFactory("Note"));
    
    // const comptrollerContract = await comptrollerFactory.deploy();
    // console.log(await comptrollerContract.deployTransaction);


    
    const args = {
	cToken: 'cNote',
	symbol: 'cnote',
	type: 'CErc20',
	underlying: noteContract.address,
	decimals: 18,
	underlyingPrice: '25022748000000000000',
	collateralFactor: '800000000000000000',
	initialExchangeRateMantissa: '200000000000000000000000000',
	interestRateModel: {
	    address: ir.address,
	    baseRatePerYear: '20000000000000000',
	    multiplierPerYear: '300000000000000000',
	},
	admin: unitrollerContract.address
    };
   
    cErc20Factory = await ethers.getContractFactory('cNote');
    const Contract = await cErc20Factory.deploy(
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

    console.log(" adad");
    
    await Contract.deployTransaction.wait();

    console.log(Contract.address);
}


main()
  .then(() => process.exit(0)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }));
