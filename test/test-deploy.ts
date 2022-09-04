

// ? this file is using mocha to do testing the deploy contract, you'll need to add @types/mocha

// imports
import {ethers} from "hardhat"
import {expect,assert} from "chai"
// this import from the fodler typechain-types will help us to specify the type for our contractFactory & contract 
import {SimpleStorage,SimpleStorage__factory} from "../typechain-types"


// describe() is simply a way to group our tests in Mocha.
describe("test", ()=>{
    let contractFactory : SimpleStorage__factory
    let SimpleStorage : SimpleStorage
    beforeEach(async ()=>{
        contractFactory = (await ethers.getContractFactory("SimpleStorage")) as SimpleStorage__factory;
        SimpleStorage = await contractFactory.deploy();
    })

    /*  
        it() is used for an individual test case. it() should be written
        as if you were saying it out loud: “It should equal zero”, 
        “It should log the user in”, etc. it() takes two arguments, 
        a string explaining what the test should do, and a callback function
         which contains our actual test: 
    */
    it("#1 it should start with a favorite number of 0", async () =>{
        const currentValue = await SimpleStorage.retrieve();
        const expectedValue="0";
        assert.equal(currentValue.toString(),expectedValue.toString(),"the current value should be 0");
    })
    it.only("#2 it Should update when we call store",async () =>{
        const expectedValue = "7";
        const transactionResponse = await SimpleStorage.store(expectedValue);
        await transactionResponse.wait(1);
        const currentValue = await SimpleStorage.retrieve();
        assert.equal(currentValue.toString(), expectedValue)
    })
});