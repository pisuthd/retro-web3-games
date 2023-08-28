const { ethers } = require("ethers")

require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts = [
  {
    privateKey: PRIVATE_KEY,
    balance: ethers.parseEther('10000').toString()
  },
  {
    privateKey : process.env.PRIVATE_KEY_2,
    balance: ethers.parseEther('10000').toString()
  },
  {
    privateKey : process.env.PRIVATE_KEY_3,
    balance: ethers.parseEther('10000').toString()
  }
]

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  mocha: {
    timeout: 1200000,
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
  },
  networks: {
    sandverse: {
      chainId: 20197,
      url: "https://rpc.sandverse.oasys.games",
      accounts: [PRIVATE_KEY],
    },
    saakuruTestnet: {
      chainId: 247253,
      url: "https://rpc-testnet.saakuru.network",
      accounts: [PRIVATE_KEY]
    },
    hardhat: {
      accounts
    }
  }
};
