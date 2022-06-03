const { ethers } = require("hardhat");

const NoteAbi = [
    "function RetAccountant() public view returns(addres)"
];

async function main() {
    const [deployer] = await ethers.getSigners();
    
    const contractInstance = await ethers.getContractAt(NoteAbi, "0xB861668Acf6734B81b9283F5e7718c4903e94908", deployer);


    var result = await contractInstance.RetAccountant();
    console.log(result);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
	console.error(error);
	process.exit(1);
    });
