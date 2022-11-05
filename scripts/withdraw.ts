import { FundMe } from './../typechain-types';
import { getNamedAccounts,ethers } from 'hardhat';




async function main(){
    const {deployer}=await getNamedAccounts();
    const fundMe : FundMe = await ethers.getContract("FundMe",deployer);
    console.log("Funding Contract...");
    const transactionResponse= await fundMe.withdraw();
    await transactionResponse.wait(1);
    console.log("Successfully withdrawn!");
}




main().then(()=>process.exit(0)).catch((error)=>{
    console.log(error);
    process.exit(1);
})