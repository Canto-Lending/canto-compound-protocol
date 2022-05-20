Deployment Guide
================
```
yarn or npm install
npx hardhat run scripts/deploy.ts --network ******
```



Folder Guide
============

Contracts
---------
Smart Contracts from Compound Protocol 

Scripts
-------
Smart Contract deployment script using **Src** folder


Src
---
config.ts / Configuration Details Params for smart contract deployment environment variables

deployment.ts / Deployment scripts using typechain - which was generated by npx hardhat compile

enum.ts / Enum Variables that has been used from the deployemtn script

interfaces.ts / Variable interfaces that have been used for the params


deployment and test guide 
1. yarn or npm install
2. if you going to deploy onto local,
 npx hardhat run script/deploy.ts 

 3. if need to deploy onto public, make .env file and add private key
 npx hardhat run script/deploy.ts --network ropsten


