const { ethers } = require("hardhat");
//const {comp} = require("./deploy01");
// TODO: remove FIJI, EVIAN, and AQUA tokens after testin

async function main() {
    const [deployer] = await ethers.getSigners();
	//RECALL COMPTROLLER ADDRESS	
	const comp = "0x579Cab9199d4CBb1004A1830e3492F5746DEF18F";    

	//DEPLOY NOTE
	const Note = await ethers.getContractFactory("Note");
    const note = await Note.deploy();

    await note.deployTransaction.wait();
    console.log("Note: ", note.address);


	const WCANTO = await ethers.getContractFactory("WCanto");
	const wcanto = await WCANTO.deploy("wCanto", "WCANTO");

	await wcanto.deployTransaction.wait(); 
	console.log("wcanto: ", await wcanto.resolvedAddress);

	//log token addresses
	const noteAddr = await note.resolvedAddress;
	const wcantoAddr = await note.resolvedAddress;

	//DEPLOY JUMP RATE INTEREST RATE MODEL
    const JumpRate = await ethers.getContractFactory("JumpRateModel");
    const jumprate = await JumpRate.deploy(
		'60000000000000000', //baseRatePerYear
		'200000000000000000', //multiplierPerYear
		'20000000000000000000', //jumpMultiplierPerYear
		'750000000000000000' //kink_
	);

    await jumprate.deployTransaction.wait();
    console.log("JumpRate: ", jumprate.address);

	const irAddr = await jumprate.resolvedAddress;

	//DEPLOY NOTE INTEREST RATE MODEL
		w


	//DEPLOY UNITROLLER
    const Unitroller = await ethers.getContractFactory("Unitroller");
    const unitroller = await Unitroller.deploy();

    await unitroller.deployTransaction.wait();
    
    console.log("Unitroller: ", unitroller.address);
	
	const unit = await unitroller.resolvedAddress;
	//ACCEPT COMPTROLLER
	const implementation = await unitroller._setPendingImplementation(comp);
    await implementation.wait();
    const accept = await unitroller._acceptImplementation();
	
	await accept.wait();

	console.log("comptroller implementation set ");
	//DEPLOY TREASURY AND AWAIT TRANSACTION TO FINALIZE
	const Treasury = await ethers.getContractFactory("Treasury");
    const treasury = await Treasury.deploy(note.address, {gasLimit: 4000000});
    await treasury.deployTransaction.wait();
    console.log("Treasury: ", treasury.address);

	const treas = await treasury.resolvedAddress;

	//DEPLOY AND INITIALIZE cNOTE LENDING MARKET
    const CNote = await ethers.getContractFactory("cNote");
    const cnote = await CNote.deploy(
		note.resolvedAddress, 
        comp, 
        jumprate.resolvedAddress, 
        unitroller.resolvedAddress
        );
   
	await cnote.deployTransaction.wait();
    console.log("CNote: ", cnote.address);

	const cnAddr = await cnote.resolvedAddress;

	// module.exports = {
	// 	noteAddr,
	// 	irAddr, 
	// 	unit,
	// 	treas,
	// 	cnAddr
	// };
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
	console.error(error);
	process.exit(1);
    });
