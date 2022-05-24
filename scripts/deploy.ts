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
      underlying: "0xef6e65Fdd4220124342994307D0D6abc74F06F97",
      underlyingPrice: '25022748000000000000',
      collateralFactor: '800000000000000000',
    },
    {
      cToken: 'cEVIAN',
      underlying: "0x82826C958b707ddE322A422f8c61E583556E225D",
      underlyingPrice: '25022748000000000000',
      collateralFactor: '800000000000000000',
    },
    {
      cToken: 'cAQUA',
      underlying: "0x33292AB53c1958356F819e436189A20C3be42B66",
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
