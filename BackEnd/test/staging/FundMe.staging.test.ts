import { assert } from 'chai';

import {network,getNamedAccounts,ethers} from "hardhat"
import { developmentChains } from './../../helper-hardhat-config';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { FundMe ,MockV3Aggregator} from './../../typechain-types';



developmentChains.includes(network.name) ?
describe.skip :
describe("FundMe",async function(){
    let fundMe :FundMe;
    let deployer : SignerWithAddress;
    const sendValue = ethers.utils.parseEther("0.1");


    beforeEach(async function(){
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        fundMe =  await ethers.getContract("FundMe",deployer.address);
    })

    it("allows peoeple to fund and withdraw", async function(){
        await fundMe.fund({value:sendValue})
        await fundMe.withdraw();
        const endingBalance = await fundMe.provider.getBalance(fundMe.address);
        assert.equal(endingBalance.toString(),"0");
    })
})