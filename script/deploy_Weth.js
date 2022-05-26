const { ethers } = require("hardhat");


async function main()  {
    const [deployer] = await ethers.getSigners();


    const WEthFactory = await ethers.getContractFactory("WEth9");
    const WEthContract = await WEthFactory.deploy("Token", "TOken");

    console.log('WEth deployed at', WEthContract.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
