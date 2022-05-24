import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Overrides } from 'ethers';
import { ethers } from 'hardhat';
import { 
    TestERC20,
    TestERC20__factory
} from '../typechain';

interface TestERC20Args {
    name: string;
    symbol: string;
    decimals: number;
    initialSupply: number;
}

async function deployTestErc20(
    args: TestERC20Args,
    deployer: SignerWithAddress,
    override?: Overrides
): Promise<TestERC20> {
   return new TestERC20__factory(deployer).deploy(
       args.name,
       args.symbol,
       args.decimals,
       args.initialSupply,
       override);
}

async function main() {
    const [deployer] = await ethers.getSigners();

    const tokenArgs: TestERC20Args[] = [
        { 
            name: "FIJI",
            symbol: "FIJI",
            decimals: 1,
            initialSupply: 100000
        },
        { 
            name: "AQUA",
            symbol: "AQUA",
            decimals: 1,
            initialSupply: 100000
        },
        { 
            name: "EVIAN",
            symbol: "EVIAN",
            decimals: 1,
            initialSupply: 100000
        }
    ];
    for (let args of tokenArgs) {
        console.log(`Starting deployment for ${args.name}`);
        const testErc20 = await deployTestErc20(args, deployer);
        await testErc20.deployed();
        console.log(`Finished deploying for ${args.name} at: `, testErc20.address);
    }
    console.log('Finished deploying all TestERC20 tokens.')
}

main().catch(console.error);