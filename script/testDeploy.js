const { ethers } = require('hardhat');

const NoteAbi = [
    "function RetAccountant() public view returns(addres)"
];

async function main() {
    const [deployer] = await ethers.getSigners();

    const comptrollerFactory = await ethers.getContractFactory("Comptroller");
    const comptrollerContract = await comptrollerFactory.deploy({gasLimit: 700000});
    console.log('#1 Comptroller Deployed at: ', comptrollerContract.address);

    //console.log(await deployer.provider.getCode("0x80062071a06c8a4bb8e5619668EA82DF36754bCc"));
    // const noteFactory = await ethers.getContractFactory("Note");
    // const noteContract = await noteFactory.deploy(
    // 	"note",
    // 	"Note",
    // 	10000000000,
    // 	deployer.address,
    // );
    // console.log("Note deployed to: ", noteContract.address);

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
