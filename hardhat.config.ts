import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const RPC_URL = process.env.RPC_URL!;
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
};

export default config;
