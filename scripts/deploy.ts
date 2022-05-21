import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { ethers } from 'hardhat';

import { CTokenDeployArg, deployCompoundV2 } from '../src';

async function main() {
  const [deployer] = await ethers.getSigners();

  const cTokenDeployArgs: CTokenDeployArg[] = [
    {
      cToken: 'cFIJI',
      underlying: "0x55B715d06eeED0943EA0F77Cf80501Ab650c71fb",
      underlyingPrice: '25022748000000000000',
      collateralFactor: '800000000000000000',
    },
    {
      cToken: 'cEVIAN',
      underlying: "0x906b2d727f5eAbceE0822AF75D2075760DD99Bc7",
      underlyingPrice: '25022748000000000000',
      collateralFactor: '800000000000000000',
    },
    {
      cToken: 'cAQUA',
      underlying: "0x90Aa61FeC065E7E086835C211c7E69419ac7Dd2d",
      underlyingPrice: '25022748000000000000',
      collateralFactor: '800000000000000000', 
    },
    {
      cToken: 'cCANTO',
      underlyingPrice: '35721743800000000000000',
      collateralFactor: '600000000000000000',
    },
  ];

  const { cTokens, comptroller, priceOracle, interestRateModels } = await deployCompoundV2(cTokenDeployArgs, deployer, { gasLimit: 8_000_000 });
  const { cCanto: cCanto, cFiji: cFiji, cEvian: cEvian, cAquafina: cAquafina } = cTokens;
}

main().catch(console.error);
