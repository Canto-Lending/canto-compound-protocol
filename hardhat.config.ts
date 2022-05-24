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
      url:'http://localhost:8545',
      accounts: process.env.LOCAL_NET_PRIVATE_KEY ? [process.env.LOCAL_NET_PRIVATE_KEY] : []
    },
    acanto: { 
      url: 'http://18.234.233.162:8545/',
      accounts: process.env.ACANTO_LIVENET_PRIVATE_KEY ? [process.env.ACANTO_LIVENET_PRIVATE_KEY] : [],
    },
    acantov2: { 
      url: 'http://104.131.11.57:8545',
      accounts: process.env.ACANTO_V2_LIVENET_PRIVATE_KEY ? [process.env.ACANTO_V2_LIVENET_PRIVATE_KEY] : [],
    }
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
