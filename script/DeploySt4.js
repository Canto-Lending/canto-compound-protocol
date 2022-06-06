const{ ethers} = require("hardhat");
//const{ noteAddr, irAddr, unit, treas, cnAddr} = require("./DeploySt2";)
//const{comp} = require("./deploy01");

const unit = "0x2dBD2b78A2c6C7ccb93d485860170B39a18fe839";

async function main () {
    const [deployer] = await ethers.getSigners();

	const GB = await ethers.getContractFactory("GovernorBravoDelegate");
	const gb = await GB.deploy();
	
	await gb.deployTransaction.wait();

	const timeLockdelay = 60 * 60 * 24 * 2; //3 days
		
	const  TimeLock = await ethers.getContractFactory("Timelock");
	const timelock = await TimeLock.deploy(deployer.address, timeLockdelay);
	await timelock.deployTransaction.wait();
	
    const GovDelegator = await ethers.getContractFactory("GovernorBravoDelegator");
    const govDelegator = await GovDelegator.deploy(timelock.address, 
                    gb.resolvedAddress, unit);

    await govDelegator.deployTransaction.wait();
    console.log("GovernorBravo: ", await gb.resolvedAddress);
    console.log("Timelock: ", await timelock.resolvedAddress);
    console.log("Governance Delegator: ", await
            govDelegator.resolvedAddress, ", Admin Set to: ", unit);
}

main()
.then(() => process.exit(0))
.catch((error) => {
console.error(error);
process.exit(1);
});