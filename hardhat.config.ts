import * as dotenv from 'dotenv';
dotenv.config();
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@thenextblock/hardhat-erc20';
import '@typechain/hardhat';

module.exports = {
  defaultNetwork: "acantov2",
  networks: {
    localhost: {
      url: 'http://localhost:8545',
      accounts: process.env.LOCAL_NET_PRIVATE_KEY ? [process.env.LOCAL_NET_PRIVATE_KEY] : []
    },
    acanto: {
      url: 'http://18.234.233.162:8545/',
      accounts: process.env.ACANTO_LIVENET_PRIVATE_KEY ? [process.env.ACANTO_LIVENET_PRIVATE_KEY] : [],
    },
    acantov2: {
      url: 'http://104.131.11.57:8545',
      accounts: ["2b11efbe0c76eb7ab40d8e43eb5e6d56524b4c33d3c8c4a9f9f552de5efec120"],
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
