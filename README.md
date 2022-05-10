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

tasks.ts / Typescript file that can handle the incoming params using the console commands
