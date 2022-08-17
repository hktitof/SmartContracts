// imports
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers"
import dotenv from "dotenv";
dotenv.config();

// Variables
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const RPC_URL = process.env.RPC_URL!;
const ETHER_SCAN_API_KEY = process.env.ETHERSCAN_API_KEY!;

const config: HardhatUserConfig = {
  // ? if you don't specify defaultNetwork it's by the default "hardhat" => defaultNetwork: "hardhat"
  solidity: "0.8.8",
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY!],
      chainId: 4,
    },
  },
  etherscan:{
    apiKey: ETHER_SCAN_API_KEY
  }
};

export default config;
