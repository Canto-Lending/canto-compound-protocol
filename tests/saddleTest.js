"use strict";

// const { dfn } = require('./JS');
const {
    // encodeParameters,
    // etherBalance,
    etherMantissa,
    etherUnsigned,
    mergeInterface
} = require('./Ethereum');
// const BigNumber = require('bignumber.js');
const { send } = require('process');

async function makeComptroller(opts = {}) {
    console.log("Entered makeComptroller here, opts: ", opts);
    const {
        root = saddle.account,
        kind = 'unitroller',
        compValue = 100
    } = opts || {};


    // if (kind == 'bool') {
    //   return await deploy('BoolComptroller');
    // }

    // if (kind == 'false-marker') {
    //   return await deploy('FalseMarkerMethodComptroller');
    // }

    // if (kind == 'v1-no-proxy') {
    //   const comptroller = await deploy('ComptrollerHarness');
    //   const priceOracle = opts.priceOracle || await makePriceOracle(opts.priceOracleOpts);
    //   const closeFactor = etherMantissa(dfn(opts.closeFactor, .051));

    //   await send(comptroller, '_setCloseFactor', [closeFactor]);
    //   await send(comptroller, '_setPriceOracle', [priceOracle._address]);

    //   return Object.assign(comptroller, { priceOracle });
    // }

    // if (kind == 'unitroller-g2') {
    //   const unitroller = opts.unitroller || await deploy('Unitroller');
    //   const comptroller = await deploy('ComptrollerScenarioG2');
    //   const priceOracle = opts.priceOracle || await makePriceOracle(opts.priceOracleOpts);
    //   const closeFactor = etherMantissa(dfn(opts.closeFactor, .051));
    //   const maxAssets = etherUnsigned(dfn(opts.maxAssets, 10));
    //   const liquidationIncentive = etherMantissa(1);

    //   await send(unitroller, '_setPendingImplementation', [comptroller._address]);
    //   await send(comptroller, '_become', [unitroller._address]);
    //   mergeInterface(unitroller, comptroller);
    //   await send(unitroller, '_setLiquidationIncentive', [liquidationIncentive]);
    //   await send(unitroller, '_setCloseFactor', [closeFactor]);
    //   await send(unitroller, '_setMaxAssets', [maxAssets]);
    //   await send(unitroller, '_setPriceOracle', [priceOracle._address]);

    //   return Object.assign(unitroller, { priceOracle });
    // }

    // if (kind == 'unitroller-g3') {
    //   const unitroller = opts.unitroller || await deploy('Unitroller');
    //   const comptroller = await deploy('ComptrollerScenarioG3');
    //   const priceOracle = opts.priceOracle || await makePriceOracle(opts.priceOracleOpts);
    //   const closeFactor = etherMantissa(dfn(opts.closeFactor, .051));
    //   const maxAssets = etherUnsigned(dfn(opts.maxAssets, 10));
    //   const liquidationIncentive = etherMantissa(1);
    //   const compRate = etherUnsigned(dfn(opts.compRate, 1e18));
    //   const compMarkets = opts.compMarkets || [];
    //   const otherMarkets = opts.otherMarkets || [];

    //   await send(unitroller, '_setPendingImplementation', [comptroller._address]);
    //   await send(comptroller, '_become', [unitroller._address, compRate, compMarkets, otherMarkets]);
    //   mergeInterface(unitroller, comptroller);
    //   await send(unitroller, '_setLiquidationIncentive', [liquidationIncentive]);
    //   await send(unitroller, '_setCloseFactor', [closeFactor]);
    //   await send(unitroller, '_setMaxAssets', [maxAssets]);
    //   await send(unitroller, '_setPriceOracle', [priceOracle._address]);

    //   return Object.assign(unitroller, { priceOracle });
    // }

    // if (kind == 'unitroller-g6') {
    //   const unitroller = opts.unitroller || await deploy('Unitroller');
    //   const comptroller = await deploy('ComptrollerScenarioG6');
    //   const priceOracle = opts.priceOracle || await makePriceOracle(opts.priceOracleOpts);
    //   const closeFactor = etherMantissa(dfn(opts.closeFactor, .051));
    //   const liquidationIncentive = etherMantissa(1);
    //   const comp = opts.comp || await deploy('Comp', [opts.compOwner || root]);
    //   const compRate = etherUnsigned(dfn(opts.compRate, 1e18));

    //   await send(unitroller, '_setPendingImplementation', [comptroller._address]);
    //   await send(comptroller, '_become', [unitroller._address]);
    //   mergeInterface(unitroller, comptroller);
    //   await send(unitroller, '_setLiquidationIncentive', [liquidationIncentive]);
    //   await send(unitroller, '_setCloseFactor', [closeFactor]);
    //   await send(unitroller, '_setPriceOracle', [priceOracle._address]);
    //   await send(unitroller, '_setCompRate', [compRate]);
    //   await send(unitroller, 'setCompAddress', [comp._address]); // harness only

    //   return Object.assign(unitroller, { priceOracle, comp });
    // }

    // if (kind == 'unitroller') {
    const unitroller = opts.unitroller || await deploy('Unitroller', { from: root });
    const comptroller = await deploy('ComptrollerHarness');

    // check for event
    // expect(comptroller).toHaveLog('Created', {});

    const priceOracle = opts.priceOracle || await makePriceOracle(opts.priceOracleOpts);
    const closeFactor = etherMantissa(.051);
    const liquidationIncentive = etherMantissa(1);
    // TODO: replace with WrappedCanto
    const comp = opts.comp || await deploy('WETH9', []);
    const compRate = etherUnsigned(1e18);

    await send(unitroller, '_setPendingImplementation', [comptroller._address]);
    await send(comptroller, '_become', [unitroller._address]);
    mergeInterface(unitroller, comptroller);
    const liquid = await send(unitroller, '_setLiquidationIncentive', [liquidationIncentive]);
    //expect(liquid).toHaveLog('Liquidate');
    await send(unitroller, '_setCloseFactor', [closeFactor]);
    await send(unitroller, '_setPriceOracle', [priceOracle._address]);
    await send(unitroller, 'setCompAddress', [comp._address]); // harness only
    const harness = await send(unitroller, 'harnessSetCompRate', [compRate]);
    // console.log("HARNESS KEYS: ",Object.keys(harness));
    // expect(harness).toHaveLog('harnessSetComp');
    // await send(comp, 'deposit', [], { from: unitroller._address, value: compValue });
    await call(unitroller, 'setCompAddress', [comp._address]);

    // const compMarkets = opts.compMarkets || [];
    // for (let cm of compMarkets) { 
    //   await send(unitroller, '_supportMarket', [cm]);
    // }

    return Object.assign(unitroller, { priceOracle, comp });
    // }
}

async function makeCToken(opts = {}) {
    const {
        root = saddle.account,
        kind = 'cerc20'
    } = opts || {};

    const comptroller = opts.comptroller || await makeComptroller(opts.comptrollerOpts);
    const interestRateModel = opts.interestRateModel || await makeInterestRateModel(opts.interestRateModelOpts);
    const exchangeRate = etherMantissa(1);
    const decimals = etherUnsigned(8);
    const symbol = opts.symbol || 'cOMG';
    const name = opts.name || `CToken ${symbol}`;
    const admin = opts.admin || root;

    let cToken, underlying;
    let cDelegator, cDelegatee, cDaiMaker;

    switch (kind) {
        // case 'cether':
        //   cToken = await deploy('CEtherHarness',
        //     [
        //       comptroller._address,
        //       interestRateModel._address,
        //       exchangeRate,
        //       name,
        //       symbol,
        //       decimals,
        //       admin
        //     ])
        //   break;

        // case 'cdai':
        //   cDaiMaker = await deploy('CDaiDelegateMakerHarness');
        //   underlying = cDaiMaker;
        //   cDelegatee = await deploy('CDaiDelegateHarness');
        //   cDelegator = await deploy('CErc20Delegator',
        //     [
        //       underlying._address,
        //       comptroller._address,
        //       interestRateModel._address,
        //       exchangeRate,
        //       name,
        //       symbol,
        //       decimals,
        //       admin,
        //       cDelegatee._address,
        //       encodeParameters(['address', 'address'], [cDaiMaker._address, cDaiMaker._address])
        //     ]
        //   );
        //   cToken = await saddle.getContractAt('CDaiDelegateHarness', cDelegator._address);
        //   break;

        // case 'ccomp':
        //   underlying = await deploy('WETH9', [], { from: (root || opts.compOwner) });
        //   cDelegatee = await deploy('CErc20DelegateHarness');
        //   cDelegator = await deploy('CErc20Delegator',
        //     [
        //       underlying._address,
        //       comptroller._address,
        //       interestRateModel._address,
        //       exchangeRate,
        //       name,
        //       symbol,
        //       decimals,
        //       admin,
        //       cDelegatee._address,
        //       "0x0"
        //     ]
        //   );
        //   cToken = await saddle.getContractAt('CErc20DelegateHarness', cDelegator._address);
        //   break;

        case 'cerc20':
        default:
            underlying = opts.underlying || await makeToken(opts.underlyingOpts);
            cDelegatee = await deploy('CErc20DelegateHarness');
            cDelegator = await deploy('CErc20Delegator',
                [
                    underlying._address,
                    comptroller._address,
                    interestRateModel._address,
                    exchangeRate,
                    name,
                    symbol,
                    decimals,
                    admin,
                    cDelegatee._address,
                    "0x0"
                ]
            );
            cToken = await saddle.getContractAt('CErc20Delegator', cDelegator._address);
            break;
    }

    // if (opts.supportMarket) {
    //   await send(comptroller, '_supportMarket', [cToken._address]);
    // }

    // if (opts.underlyingPrice) {
    //   const price = etherMantissa(opts.underlyingPrice);
    //   await send(comptroller.priceOracle, 'setUnderlyingPrice', [cToken._address, price]);
    // }

    // if (opts.collateralFactor) {
    //   const factor = etherMantissa(opts.collateralFactor);
    //   expect(await send(comptroller, '_setCollateralFactor', [cToken._address, factor])).toSucceed();
    // }

    return Object.assign(cToken, { name, symbol, underlying, comptroller, interestRateModel });
}

const [root] = saddle.accounts;

// TODO: how much weth/comp should we initialize comptroller with

async function main() {
    const comptroller = await makeComptroller({ root: root, compValue: 300 });
    await makeCToken({ comptroller, supportMarket: true, symbol: 'cLOW', underlyingPrice: 1, interestRateModelOpts });
}
main();