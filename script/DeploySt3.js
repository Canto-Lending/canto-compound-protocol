const{ ethers} = require("hardhat");
//const{ noteAddr, irAddr, unit, treas, cnAddr} = require("./DeploySt2";)
//const{comp} = require("./deploy01");

const NoteAbi = [
 "function _setAccountantAddress(address) external"
];

const noteAddr = "0xdf6bc047aE5305FD57Cf17DEc690db5e5A722206";
const unit = "0x2dBD2b78A2c6C7ccb93d485860170B39a18fe839";
const JumpRate = "0x42662DeE4f4Ba9fE202c95e2C609DB0E7D1b1516"; 
const cnAddr = "0xad4d1e3c352641ef67e7803425e549eA548a15aE";
const treas = "0xB80209Fbb757e76016fa7d7B51CfE6f3c54fd300";
const comp = "0x579Cab9199d4CBb1004A1830e3492F5746DEF18F";

async function main () {
	const [deployer] = await ethers.getSigners();
	//DEPLOY ACCOUNTANT CONTRACT, LINKED TO NOTE/CNOTE MM, TREASURY, and COMPTROLLER
	const Acct = await ethers.getContractFactory("Accountant"); 
    const acct = await Acct.deploy(
        noteAddr, 
        cnAddr, 
        treas,
		comp
        );        
    await acct.deployTransaction.wait();
    console.log("Accountant: ", acct.address);

	//CONFIGURE COMPTROLLER
	const setMarket = await (await ethers.getContractAt("Comptroller", 
		comp, deployer)).
		_supportMarket(cnAddr, {gasLimit:400000});

	const setPrice = await (await ethers.getContractAt("Comptroller", comp, deployer)).
		_setPriceOracle(JumpRate);

	await Promise.all([setPrice, setMarket]);
	console.log("Cofiguration Complete");
	
	
	//INITIALIZE ACCOUNTANT (ENTER CNOTE MM)
    const AcctInit = await acct.initialize();

	console.log("Accountant initialized");

    await AcctInit.wait();

	//DEPLOY COMPOUND LENS
	const CompLens = await ethers.getContractFactory("CompoundLens");
	complens = await CompLens.deploy();

	await complens.deployTransaction.wait();
	console.log("Compound Lens: ", await complens.resolvedAddress);

	//Deploy CCANTO contract
	const CCANTO = await ethers.getContractFactory("CEther");
	const ccanto = await CCANTO.deploy(
		comp,
		JumpRate,
		1,
		"cCanto",
		"CCANTO",
		18,
		unit
	);
	await ccanto.deployTransaction.wait();
	console.log("CCANTO: ", await ccanto.resolvedAddress);

	const AcctSet = await (await ethers.getContractAt("cNote", cnAddr, deployer))
			._setAccountantContract(acct.resolvedAddress, {gasLimit: 200000});
	await AcctSet.wait();

	// console.log(await (await ethers.getContractAt("Note", noteAddr, deployer)).
	// 		_setAccountantAddress());
}

main()
.then(() => process.exit(0))
.catch((error) => {
console.error(error);
process.exit(1);
});