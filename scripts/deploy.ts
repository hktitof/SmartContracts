import { SimpleStorage } from './../typechain-types/SimpleStorage';
/* 
Commands : 
deploy contract to hardhat : $ yarn hardhat run scripts/deploy.ts --network hardhat
*/

//imports
// INFORMATIONAL  run : allows us to run any Hardhat tasks for us
import { ethers, run, network } from "hardhat";
//async main/
async function main() {
  const contract_var = await ethers.getContractFactory("test");
  console.log("Deploying contract...");
  const contract = await contract_var.deploy();
  // wait for the contract to be deployed, it might also be block confirmation
  await contract.deployed();
  console.log(`Deployed contract to : ${contract.address}`);
  console.log(network.config);
  // we need to verify the chainId and the availability of hte etherscan API Key on .env
  // the verification process may take a while like 10 mins who konws HHhhh
  if(network.config.chainId==4 && process.env.ETHERSCAN_API_KEY){
    console.log("waiting for 5 blocks confirmations...");
    await contract.deployTransaction.wait(5);
    console.log("waiting for contract verfification...")
    await verify(contract.address, []);
  }
}
// verify function : it's for contract verification on etherscan programmatically through etherscan API
async function verify(contractAddress:string, args:any) {
  console.log("verfiying contract...");
  // try catch is used to check the process, because sometimes it might be already verified
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    // use instanceof to ccheck if the error is an instance of the Error object.
    if (error instanceof Error) {
      if(error.message.toLowerCase().includes("already verified")){
        console.log("contract already verified");
      }
      // Uncomment this following 3 lines to get other error if exists and details,
      // and not only if it's already verified
      
      else{
        console.error("Unfortunately Titof this is your Error Message : -----------------------\n", error);
      }
    } else {
      console.error("Unexpected error : ", error);
    }
  }
}
// main
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
