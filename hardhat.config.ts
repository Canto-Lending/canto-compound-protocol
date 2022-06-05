import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

const config: HardhatUserConfig = {
  networks: {
  localhost: {
  url: "http://localhost:8545",
  accounts: ["d5224d4ffc038aecab1a8580b204c8b1520bfaf4e2ccc9e787fdadc7371ab534"]
},
 ropsten: {
      url: "https://ropsten.infura.io/v3/a326dd3699ae4eb0b675684ad801ffe5",
      accounts: ["76adecc7c50713e82acfbce851bb957ffeb85043591e62667a26a4e6851aa5b3"]
    },
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