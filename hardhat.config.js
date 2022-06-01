require("@nomiclabs/hardhat-waffle");

module.exports = {
    networks: {
	localnet: { 
	    url:'http://localhost:8545',
	    //accounts: process.env.LOCAL_NET_PRIVATE_KEY ? [process.env.LOCAL_NET_PRIVATE_KEY] : []
	    accounts: ["2f9e8b6c2a8fea5ea907f7547359b7bf8ea9be1070a95290a81b62639efc1d9d"]
	},
	livenet: { 
	    url: 'http://137.184.130.158:8545',
	accounts: ["2bbb5a3abf979e87f3e95d4b1768223a07dcdcd837b14016ae4bf32786a4e5f4"],
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

