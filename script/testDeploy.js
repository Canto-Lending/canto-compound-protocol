const { ethers } = require('hardhat');

const NoteAbi = [
    "function RetAccountant() public view returns(addres)"
];

const ComptrollerAbi = [
    "function enterMarkets(address[] memory) returns (uint[] memory)", 
    "function _setPriceOracle(address) public returns(uint)"
];


async function main() {
    const [deployer] = await ethers.getSigners();
    
    // const noteFactory = await ethers.getContractFactory("Note");
    // const noteContract = await noteFactory.deploy(
    // 	"note",
    // 	"Note",
    // 	10000000000,
    // );
    // console.log(noteContract.address);

    //await noteContract.deployTransaction.wait();
    console.log(await deployer.provider.getCode("0x8A9BB36391daF14e23DAdc309Be570dD519cBfc5"));
    
    // const comptrollerContract = await comptrollerFactory.deploy();
    // console.log(await comptrollerContract.deployTransaction);


}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
