import {
  CTokenType,
  InterestRateModelType
} from './enums';
import {
  CTokenConfigs,
  InterestRateModelConfigs
} from './interfaces';

export const RESERVOIR_DRIP_RATE = '6944444444000000';

export const INTEREST_RATE_MODEL: InterestRateModelConfigs = {
  Base200bps_Slope1000bps: {
    name: 'Base200bps_Slope1000bps',
    type: InterestRateModelType.WhitePaperInterestRateModel,
    args: {
      baseRatePerYear: '20000000000000000',
      multiplierPerYear: '100000000000000000',
    },
  },
  Base200bps_Slope3000bps: {
    name: 'Base200bps_Slope3000bps',
    type: InterestRateModelType.WhitePaperInterestRateModel,
    args: {
      baseRatePerYear: '20000000000000000',
      multiplierPerYear: '300000000000000000',
    },
  },
  Base500bps_Slope1200bps: {
    name: 'Base500bps_Slope1200bps',
    type: InterestRateModelType.WhitePaperInterestRateModel,
    args: {
      baseRatePerYear: '50000000000000000',
      multiplierPerYear: '120000000000000000',
    },
  },
  IRM_COMP_Updateable: {
    name: 'IRM_COMP_Updateable',
    type: InterestRateModelType.JumpRateModelV2,
    args: {
      baseRatePerYear: '20000000000000000',
      multiplierPerYear: '180000000000000000',
      jumpMultiplierPerYear: '4000000000000000000',
      kink: '800000000000000000',
      owner: '0x00',
    },
  },
  IRM_UNI_Updateable: {
    name: 'IRM_UNI_Updateable',
    type: InterestRateModelType.JumpRateModelV2,
    args: {
      baseRatePerYear: '20000000000000000',
      multiplierPerYear: '180000000000000000',
      jumpMultiplierPerYear: '4000000000000000000',
      kink: '800000000000000000',
      owner: '0x00',
    },
  },
  IRM_USDC_Updateable: {
    name: 'IRM_USDC_Updateable',
    type: InterestRateModelType.LegacyJumpRateModelV2,
    args: {
      baseRatePerYear: '0',
      multiplierPerYear: '40000000000000000',
      jumpMultiplierPerYear: '1090000000000000000',
      kink: '800000000000000000',
      owner: '0x00',
    },
  },
  IRM_USDT_Updateable: {
    name: 'IRM_USDT_Updateable',
    type: InterestRateModelType.JumpRateModelV2,
    args: {
      baseRatePerYear: '0',
      multiplierPerYear: '40000000000000000',
      jumpMultiplierPerYear: '1090000000000000000',
      kink: '800000000000000000',
      owner: '0x00',
    },
  },
  wbtc2_irm: {
    name: 'wbtc2_irm',
    type: InterestRateModelType.JumpRateModelV2,
    args: {
      baseRatePerYear: '20000000000000000',
      multiplierPerYear: '180000000000000000',
      jumpMultiplierPerYear: '1000000000000000000',
      kink: '800000000000000000',
      owner: '0x00',
    },
  },
};

export const CTOKEN: CTokenConfigs = {
  cCANTO: {
    symbol: 'cCANTO',
    type: CTokenType.CEther,
    args: {
      comptroller: '0x',
      interestRateModel: 'cCANTO-interest-rate-model',
      initialExchangeRateMantissa: '200000000000000000000000000',
      name: 'Compound Canto',
      symbol: 'cCANTO',
      decimals: 8,
      admin: '0x00',
    },
    interestRateModel: INTEREST_RATE_MODEL.Base200bps_Slope1000bps,
  },
  cAQUA: {
    symbol: 'cAQUA',
    type: CTokenType.CErc20,
    args: {
      underlying: '0x',
      comptroller: '0x',
      interestRateModel: '0x',
      initialExchangeRateMantissa: '200000000000000000000000000',
      name: 'Compound AQUA Token',
      symbol: 'cAQUA',
      decimals: 8,
      admin: '0x00',
    },
    interestRateModel: INTEREST_RATE_MODEL.Base200bps_Slope3000bps,
  },
  cEVIAN: {
    symbol: 'cEVIAN',
    type: CTokenType.CErc20,
    args: {
      underlying: '0x',
      comptroller: '0x',
      interestRateModel: '0x',
      initialExchangeRateMantissa: '200000000000000000000000000',
      name: 'Compound EVIAN Token',
      symbol: 'cEVIAN',
      decimals: 8,
      admin: '0x00',
    },
    interestRateModel: INTEREST_RATE_MODEL.Base200bps_Slope3000bps,
  },
  cFIJI: {
    symbol: 'cFIJI',
    type: CTokenType.CErc20,
    args: {
      underlying: '0x',
      comptroller: '0x',
      interestRateModel: '0x',
      initialExchangeRateMantissa: '200000000000000000000000000',
      name: 'Compound FIJI Token',
      symbol: 'cFIJI',
      decimals: 8,
      admin: '0x00',
    },
    interestRateModel: INTEREST_RATE_MODEL.Base200bps_Slope3000bps,
  }
};
