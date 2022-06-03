require("@nomiclabs/hardhat-waffle");

module.exports = {
    networks: {
	localnet: { 
	    url:'http://localhost:8545',
	    //accounts: process.env.LOCAL_NET_PRIVATE_KEY ? [process.env.LOCAL_NET_PRIVATE_KEY] : []
	    accounts: ["74ab7f9825dd7384ea09dade219d2ddaed023930d93240646bbdcb19806cf674"]
	},
	livenet: { 
	    url: 'http://137.184.130.158:8545',
	    accounts: ["c541c56156089559a21c95bbdbca48b6846b8dc006d3241daddd00f1154b495e"],
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

