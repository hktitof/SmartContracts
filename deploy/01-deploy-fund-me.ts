import { network } from 'hardhat';
// import 
// main function
// calling of main function



// the paramerters below are the same as " const {getNamedAccounts, deployments} = hre "
export default async ({getNamedAccounts,deployments})=> {
    const {deploy, log}=deployments;
    const {deployer} = await getNamedAccounts();
    const chaindId = network.config.chainId;
}