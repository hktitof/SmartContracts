import { deployments, ethers, getNamedAccounts } from "hardhat";
import { assert, expect } from "chai";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

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
  // test for the constructor
  describe("constructor", function() {
    it("sets the aggregator addresses correctly", async () => {
      const response = await fundMe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });
  // test for the fundMe function
  describe("fund", async () => {
    it("Fails if you don't send enough ETH", async () => {
      await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
    });
    it("updated the amount funded in addressToAmountFunded Array by the sender", async () => {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer.address);
      assert.equal(response.toString(), sendValue.toString());
    });
    it("Check if the sender Address is added to funders Array", async () => {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.funders(0);
      assert.equal(funder, deployer.address);
    });
  });

  // test for the withdraw function
  describe("Withraw", async () => {
    // before withdraw it must be funded
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });
    it("withdraw ETH from a single founder : ", async () => {
      /**
       * this is gonna a long a test, so we will break it down into 3 parts
       * 1. Arrange
       * 2. Act
       * 3. Assert
       */
      // 1. Arrange
      // get the balance of the deployer and the contract before withdraw
      const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
      const startingDeployerBalance = await fundMe.provider.getBalance(deployer.address);
      // 2. Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      const endingFundMeBlance = await fundMe.provider.getBalance(fundMe.address);
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

      // 3. Assert
      // Note that the deployer has spent some gas, so we need to account for that
      assert.equal(endingFundMeBlance.toString(), String("0"));
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });

    it("allows us to withdraw with multiple funders", async () => {
      const accounts = await ethers.getSigners(); // get all accounts
      // Arrange process

      // fund the contract from 6 accounts, note that account 0 is the deployer
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }
      const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
      const startingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

      //Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      //Assert
      const endingFundMeBlance = await fundMe.provider.getBalance(fundMe.address);
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer.address);
      assert.equal(endingFundMeBlance.toString(), String("0"));
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );

      // Make sure that the funders array is empty
      await expect(fundMe.funders(0)).to.be.reverted;
      for (let i = 1; i < 6; i++) {
        assert.equal(await (await fundMe.addressToAmountFunded(accounts[i].address)).toString(), "0");
      }
    });


    //test Only owner allowed to withdraw
    it("Only owner allowed to withdraw", async () => {
      const accounts = await  ethers.getSigners();
      const attacker= accounts[1];
      const attackerConnectedContract = await fundMe.connect(attacker);
      const result = await expect(attackerConnectedContract.withdraw()).to.be.revertedWithCustomError(attackerConnectedContract,"FunMe__NotOwner");

    });

  });
});
