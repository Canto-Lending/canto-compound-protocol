import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

const config: HardhatUserConfig = {
  networks: {
  localhost: {
  url: "http://localhost:8545",
  accounts: ["1687b5cc96be466b621686926efd4f9d5658ca242013e5866347c7aaba884846"]
}
},
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  paths: {
  sources: "./contracts",
  tests: "./test",
  cache:"./cache",
  artifacts: "./artifacts"
  }
};

export default config;