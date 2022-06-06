const {ethers} = require("hardhat");


async function main() {
    //Comptroller Deployment
    const [deployer] = await ethers.getSigners();

    //DEPLOY COMPTROLLER 
    const Comptroller = await ethers.getContractFactory("Comptroller");
    const comptroller = await Comptroller.deploy();


    //AWAIT TRANSACTION TO FINALIZE
    await comptroller.deployTransaction.wait();

    console.log("Comptroller: ", comptroller.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
	console.error(error);
	process.exit(1);
    });
