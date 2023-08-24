// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const verifier = await hre.ethers.deployContract("Verifier", [], { gasLimit: "0x1000000" });

  // console.log("deploying verifier...")

  // await verifier.waitForDeployment();

  // console.log("deploying msweeper...")

  // const msweeper = await hre.ethers.deployContract("Minesweeper", [verifier.target ], { gasLimit: "0x1000000" });

  // await msweeper.waitForDeployment();

  // console.log(
  //   `Deployed Minesweeper contract to ${msweeper.target}`
  // );

  // const faucet = await hre.ethers.deployContract("Faucet", [], { gasLimit: "100000000000" });

  // console.log("deploying Faucet...")

  // await faucet.waitForDeployment();

  // console.log(
  //   `Deployed Faucet contract to ${faucet.target}`
  // );

  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy({  gasLimit: "3000000000000000000"  });

  await faucet.deployed()

  console.log("Faucet ADDRESS : ", faucet.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
