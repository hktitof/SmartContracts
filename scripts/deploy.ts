//imports
import {ethers} from "hardhat"
//async main/
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStroage = await SimpleStorageFactory.deploy();
  // wait for the contract to be deployed, it might also be block confirmation
  await simpleStroage.deployed();
  console.log(`Deployed contract to : ${simpleStroage.address}`);
}

// main
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
