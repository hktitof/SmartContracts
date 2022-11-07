// by running ts-node for this file, we're deploying the contract on Ganach
import { ethers } from "ethers";
import fs from "fs-extra";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_URL!
  );
  // by using "!" we are asserting that the environment variable is defined
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const abi = fs.readFileSync("../TestContract.abi/Test1.abi", "utf8");
  const bin = fs.readFileSync("../TestContract.bin/Test1.bin", "utf8");
  const contractFactory = new ethers.ContractFactory(abi, bin, wallet);
  console.log("Deploying contract, please wait...");
  // ? deploying contract with ether
  //? you can pass to deploy() many arguments
  //? like deploy({gasLimit: 1000000,gasLimit: 1000000, ...etc })
  const contract = await contractFactory.deploy(); // ? STOP HERE! wait for contract to deploy
  console.log("Contract is deployed, now waiting One block Confirmation...");
  // ? wait one block to make sure it actually get attached to the chain
  const transactionReceipt = await contract.deployTransaction.wait(1);
  // ? deploymenet transaction is what you get just when you create your transaction
  // ! UNCOMMENT console.log("Here is the deployment transaction : \n",contract.deployTransaction);
  // ? transaction receipt is what you get when you wait for a transaction to finish
  // ! UNCOMMENT console.log("Here is the transaction receipt : \n",transactionReceipt);
  const currentnValue = await contract.val();
  console.log(`curent value is ${currentnValue}`);
  const transactionResponse2 = await contract.setOwner("7");
  await transactionResponse2.wait(1);
  const newValue = await contract.val();
  console.log(`new value is ${newValue}`);
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
 