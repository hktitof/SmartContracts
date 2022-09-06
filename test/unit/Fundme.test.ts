import { deployments, ethers, getNamedAccounts } from "hardhat";
import { assert, expect } from "chai";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("FundMe", async () => {
  let fundMe: FundMe;
  let deployer: SignerWithAddress;
  let mockV3Aggregator: MockV3Aggregator;
  const sendValue = ethers.utils.parseEther("1"); // 1 ether hardcode
  beforeEach(async () => {
    // deploy our fundMe contract
    // using Hardhat-deploy
    // ? you grab also accounts if you need them
    /**
     * const accounts = await ethers.getSigners();
     * const accountZero = accounts[0];
     */
    const accounts = await ethers.getSigners();
    deployer = accounts[0]; // we will abstract deployer from the return value of getNamedAccounts
    await deployments.fixture(["all"]); // deploy all contracts that export the tag "all"
    fundMe = await ethers.getContract("FundMe"); // getContract will get the most recently deployed "FundMe" contract
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", function() {
    it("sets the aggregator addresses correctly", async () => {
      const response = await fundMe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });
  describe("fund", async () => {
    it("Fails if you don't send enough ETH", async () => {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });
    it("updated the amount funded in addressToAmountFunded Array by the sender", async () => {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer.address);
      assert.equal(response.toString(), sendValue.toString());
    });
  });
});
