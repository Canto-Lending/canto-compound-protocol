const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    const contractInstance = await ethers.getContractAt("treasury", );


    var result = await contractInstance.mint(1);
    console.log(result);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
	console.error(error);
	process.exit(1);
    });
