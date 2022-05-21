import * as dotenv from 'dotenv';
dotenv.config();
import '@nomiclabs/hardhat-ethers';
import '@thenextblock/hardhat-erc20';
import '@typechain/hardhat';

module.exports = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      forking:{
        url: "https://eth-mainnet.alchemyapi.io/v2/<key>",
      }
    },
    cantolocal: { 
      url: process.env.LOCAL_NET || '',
      accounts: [process.env.LOCAL_NET_PRIVATE_KEY]
    },
    rinkeby: {
      url: process.env.ROPSTEN_URL || '',
      // initialBaseFeePerGas: 100,
      gasPrice: 3000000000,
      // minGasPrice: ethers.utils.parseUnits("50", "gwei").toString(),
      // blockGasLimit: 15000000,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    tevmos: {
      url: 'https://testnet.canto-testnet.com/evm/rpc',
      accounts: process.env.TEVMOS_PRIVATE_KEY ? [process.env.TEVMOS_PRIVATE_KEY] : [],
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  solidity: {
    compilers: [
      {
        version: '0.5.16',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.5.16',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};
