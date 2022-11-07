import { task } from "hardhat/config";

task("block-number", "Prints The current Block Number.").setAction(
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("the current block number is: " + blockNumber);
  }
);
