import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Overrides } from 'ethers';
import { text } from 'stream/consumers';

import {
  BaseJumpRateModelV2,
  CErc20Delegate,
  CErc20Delegate__factory,
  CErc20Delegator,
  CErc20Delegator__factory,
  CErc20Immutable,
  CErc20Immutable__factory,
  CEther,
  CEther__factory,
  Comptroller,
  Comptroller__factory,
  Unitroller,
  Unitroller__factory,
  Reservoir, 
  Reservoir__factory,
  JumpRateModelV2__factory,
  LegacyJumpRateModelV2__factory,
  SimplePriceOracle,
  SimplePriceOracle__factory,
  WhitePaperInterestRateModel,
  WhitePaperInterestRateModel__factory,
} from '../typechain';

import { CTOKEN, INTEREST_RATE_MODEL } from './configs';
import { CTokenType, InterestRateModelType } from './enums';
import {
  CErc20Args,
  CErc20DelegatorArgs,
  CEthArgs,
  CompoundV2,
  CTokenArgs,
  CTokenDeployArg,
  CTokenLike,
  CTokens,
  InterestRateModelConfig,
  InterestRateModels,
  JumpRateModelV2Args,
  LegacyJumpRateModelV2Args,
  WhitePaperInterestRateModelArgs,
} from './interfaces';

function getTypeFromId(id: number) {
  switch(id) {
    case InterestRateModelType.WhitePaperInterestRateModel:
      return "WhitePaperInterestRateModel";
    case InterestRateModelType.JumpRateModelV2:
      return "JumpRateModelV2";
    case InterestRateModelType.LegacyJumpRateModelV2:
      return "LegacyJumpRateModelV2";
    default:
      break;
  }
}

// Deployment order: comptroller -> unitroller -> reservoir -> price oracle -> ctokens
export async function deployCompoundV2(
  underlying: CTokenDeployArg[],
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<CompoundV2> {

  const comptroller = await deployComptroller(deployer, overrides);
  await comptroller.deployed();
  console.log('#1 Comptroller Deployed at: ', comptroller.address);

  const unitroller = await deployUnitroller(deployer, overrides);
  await unitroller.deployed();
  console.log("Unitroller Deployed At: ", unitroller.address);

  const setPendingImpTx = await unitroller._setPendingImplementation(comptroller.address, overrides);
  await setPendingImpTx.wait();
  console.log("Set unitroller implementation to :", comptroller.address);

  const acceptImpTx = await unitroller.connect(comptroller.signer)._acceptImplementation(overrides);
  await acceptImpTx.wait();
  console.log("Accepted Unitroller implementation for: ", comptroller.address);

  const reservoir = await deployReservoir(deployer, unitroller.address, overrides);
  await reservoir.deployed();
  console.log("Reservoir Deployed At: ", reservoir.address);

 const priceOracle = await deployPriceOracle(deployer, overrides);
  await priceOracle.deployed();
  console.log('#2 PriceOracle Deployed at: ', priceOracle.address);

  const tx = await comptroller._setPriceOracle(priceOracle.address);
  await tx.wait();
  console.log('#3 comptroller._setPriceOracle Done');

  const interestRateModelArgs = Object.values(INTEREST_RATE_MODEL);
  const interestRateModels = await deployInterestRateModels(interestRateModelArgs, deployer);
  // await interestRateModels.deployed();
  console.log('#4 interestRateModels Deployed ');
  for (const item of interestRateModelArgs) {
    console.log(`${item.name} (${getTypeFromId(item.type)}) deployed at : `, interestRateModels[item.name].address);
  }

  const cTokenLikes = await deployCTokens(
    underlying,
    interestRateModels,
    priceOracle,
    comptroller,
    deployer,
    overrides
  );
  // await cTokenLikes.deployed();

  cTokenLikes.map((_ctoken, index) => {
    console.log(`#5-${index + 1} CTokens Deployed at: ', ${_ctoken.address}`);
  });

  const cTokens = new CTokens();
  underlying.forEach((u, idx) => {
    cTokens[u.cToken] = cTokenLikes[idx];
  });

  return {
    comptroller,
    priceOracle,
    interestRateModels,
    cTokens,
  };
}

async function deployCTokens(
  deployArgs: CTokenDeployArg[],
  irm: InterestRateModels,
  priceOracle: SimplePriceOracle,
  comptroller: Comptroller,
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<CTokenLike[]> {
  const cTokens: CTokenLike[] = [];
  for (const u of deployArgs) {
    console.log('Starting token deployment for: ', u);
    const cTokenConf = CTOKEN[u.cToken];
    const cTokenArgs = cTokenConf.args as CTokenArgs;
    cTokenArgs.comptroller = comptroller.address;
    cTokenArgs.underlying = u.underlying || '0x00';
    cTokenArgs.interestRateModel = irm[cTokenConf.interestRateModel.name].address;
    cTokenArgs.admin = deployer.address;
    if (cTokenConf.type === CTokenType.CErc20Delegator) {
      cTokenArgs.implementation = (await deployCErc20Delegate(deployer, overrides)).address;
    }
    const cToken =
      cTokenConf.type === CTokenType.CEther
        ? await deployCEther(cTokenArgs, deployer, overrides)
        : await deployCToken(cTokenArgs, deployer, overrides);

    // ? anything else needed for comptroller to support cToken? currently only calling support market and setCollateralFactor
    await comptroller._supportMarket(cToken.address, overrides);

    // TODO: remove constant price in simple price oracle and add constnat underlyingPrices for each token
    if (cTokenConf.type === CTokenType.CEther) {
      await priceOracle.setDirectPrice(cToken.address, u.underlyingPrice || 0, overrides);
    } else {
      await priceOracle.setUnderlyingPrice(cToken.address, u.underlyingPrice || 0, overrides);
    }

    if (u.collateralFactor) {
      await comptroller._setCollateralFactor(cToken.address, u.collateralFactor, overrides);
    }

    cTokens.push(cToken);
  }
  return cTokens;
}

export async function deployCToken(
  args: CTokenArgs,
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<CTokenLike> {
  console.log('Starting CToken deployment for: ', args);
  if ('implementation' in args) {
    return deployCErc20Delegator(args as CErc20DelegatorArgs, deployer, overrides);
  }
  return deployCErc20Immutable(args, deployer, overrides);
}

export async function deployReservoir(
  deployer: SignerWithAddress,
  target_: string,
  overrides?: Overrides
): Promise<Reservoir> {
  return new Reservoir__factory(deployer).deploy("6944444444000000", target_, overrides);
}

export async function deployUnitroller(
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<Unitroller> {
  return new Unitroller__factory(deployer).deploy(overrides);
}

export async function deployComptroller(
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<Comptroller> {
  return new Comptroller__factory(deployer).deploy(overrides);
}

export async function deployWhitePaperInterestRateModel(
  args: WhitePaperInterestRateModelArgs,
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<WhitePaperInterestRateModel> {
  return new WhitePaperInterestRateModel__factory(deployer).deploy(
    args.baseRatePerYear,
    args.multiplierPerYear,
    overrides
  );
}

export async function deployJumpRateModelV2(
  args: JumpRateModelV2Args,
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<BaseJumpRateModelV2> {
  return new JumpRateModelV2__factory(deployer).deploy(
    args.baseRatePerYear,
    args.multiplierPerYear,
    args.jumpMultiplierPerYear,
    args.kink,
    args.owner,
    overrides
  );
}

export async function deployLegacyJumpRateModelV2(
  args: LegacyJumpRateModelV2Args,
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<BaseJumpRateModelV2> {
  return new LegacyJumpRateModelV2__factory(deployer).deploy(
    args.baseRatePerYear,
    args.multiplierPerYear,
    args.jumpMultiplierPerYear,
    args.kink,
    args.owner,
    overrides
  );
}

async function deployInterestRateModels(
  items: InterestRateModelConfig[],
  deployer: SignerWithAddress,
  overrides?: Overrides
) {
  const models: InterestRateModels = {};
  let model;
  for (const item of items) {
    if ('owner' in item.args) {
      item.args.owner = deployer.address;
    }
    if (item.type === InterestRateModelType.WhitePaperInterestRateModel) {
      model = await deployWhitePaperInterestRateModel(
        item.args as WhitePaperInterestRateModelArgs,
        deployer,
        overrides
      );
    } else if (item.type === InterestRateModelType.LegacyJumpRateModelV2) {
      model = await deployLegacyJumpRateModelV2(
        item.args as LegacyJumpRateModelV2Args,
        deployer,
        overrides
      );
    } else {
      model = await deployJumpRateModelV2(item.args as JumpRateModelV2Args, deployer, overrides);
    }
    models[item.name] = model;
  }
  return models;
}

export async function deployPriceOracle(
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<SimplePriceOracle> {
  return new SimplePriceOracle__factory(deployer).deploy(overrides);
}

export async function deployCEther(
  args: CEthArgs,
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<CEther> {
  console.log('Starting CEther deployment for: ', args);
  return new CEther__factory(deployer).deploy(
    args.comptroller,
    args.interestRateModel,
    args.initialExchangeRateMantissa,
    args.name,
    args.symbol,
    args.decimals,
    args.admin,
    overrides
  );
}

export async function deployCErc20Immutable(
  args: CErc20Args,
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<CErc20Immutable> {
  return new CErc20Immutable__factory(deployer).deploy(
    args.underlying,
    args.comptroller,
    args.interestRateModel,
    args.initialExchangeRateMantissa,
    args.name,
    args.symbol,
    args.decimals,
    args.admin,
    overrides
  );
}

export async function deployCErc20Delegator(
  args: CErc20DelegatorArgs,
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<CErc20Delegator> {
  return new CErc20Delegator__factory(deployer).deploy(
    args.underlying,
    args.comptroller,
    args.interestRateModel,
    args.initialExchangeRateMantissa,
    args.name,
    args.symbol,
    args.decimals,
    args.admin,
    args.implementation,
    '0x00',
    overrides
  );
}

export async function deployCErc20Delegate(
  deployer: SignerWithAddress,
  overrides?: Overrides
): Promise<CErc20Delegate> {
  return new CErc20Delegate__factory(deployer).deploy(overrides);
}
