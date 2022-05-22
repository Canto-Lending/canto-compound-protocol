import { ethers } from 'hardhat';
import {
  CTokenDeployArg,
  deployCompoundV2
} from '../src';

async function main() {
  const [deployer] = await ethers.getSigners();

  const cTokenDeployArgs: CTokenDeployArg[] = [
    {
      cToken: 'cFIJI',
      underlying: "0x382166cC4BDd149038FCF0AC7CA5ACfd89dB8366",
      underlyingPrice: '25022748000000000000',
      collateralFactor: '800000000000000000',
    },
    {
      cToken: 'cEVIAN',
      underlying: "0x785B9De1933f7d076A6CcBf7A0C29f9A73ce422c",
      underlyingPrice: '25022748000000000000',
      collateralFactor: '800000000000000000',
    },
    {
      cToken: 'cAQUA',
      underlying: "0x5c87cFe3610a465FF27298301ab06E8Fd384199A",
      underlyingPrice: '25022748000000000000',
      collateralFactor: '800000000000000000', 
    },
    {
      cToken: 'cCANTO',
      underlyingPrice: '35721743800000000000000',
      collateralFactor: '600000000000000000',
    },
  ];

  await deployCompoundV2(cTokenDeployArgs, deployer, { gasLimit: 8_000_000 });
  // const { cTokens, comptroller, priceOracle, interestRateModels } = await deployCompoundV2(cTokenDeployArgs, deployer, { gasLimit: 8_000_000 });
  // const { cCanto: cCanto, cFiji: cFiji, cEvian: cEvian, cAquafina: cAquafina } = cTokens;
}

main().catch(console.error);
