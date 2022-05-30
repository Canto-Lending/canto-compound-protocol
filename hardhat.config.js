require("@nomiclabs/hardhat-waffle");

module.exports = {
    networks: {
	localnet: { 
	    url:'http://localhost:8545',
	    //accounts: process.env.LOCAL_NET_PRIVATE_KEY ? [process.env.LOCAL_NET_PRIVATE_KEY] : []
	    accounts: ["8e6a8df6d6fcd7bbfdd429c3daea317e0139701d5a41e8ce35d27aeb35e3ef23"]
	},
	livenet: { 
	    url: 'https://evm.canto-testnet.com',
	    accounts: ["b3553888442265a9e3394073d40b6278b10ea0d487b420ca9c5b209761f92dbc"],
	    gasPrice: 100000000000
	}
    },
    solidity: {
	    compilers: [
		{
		    version: "0.8.13",
		},
		{
		    version: "0.5.16",
		}
	    ],
	settings: {
	    optimizer: {
		enabled: true,
		runs: 200
	    }
	}
    },
    paths: {
	sources: "./contracts",
	tests: "./test",
	cache: "./cache",
	artifacts: "./artifacts"
    },
    mocha: {
	timeout: 40000
    }
}

