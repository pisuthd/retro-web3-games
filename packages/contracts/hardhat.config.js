require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY

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
    }
  }
};
