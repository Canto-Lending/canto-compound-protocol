const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    const contractInstance = new ethers.Contract("0xb7Bf8Ba2D00425fbd027112A3D7Fb4424e572d01", testTokenAbi, signer);


    var result = await contractInstance.mint(1);
    console.log(result);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
	console.error(error);
	process.exit(1);
    });
