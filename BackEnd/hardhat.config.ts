// imports
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";
dotenv.config();
import "./tasks/block_number";
// gas reporter it tells us when we do our tests how much gas it cost either deploy or calling functions
import "hardhat-gas-reporter";
// coverage is used to know how our tests are
import "solidity-coverage";
// this one is used to give our Contract a correct typing
// we use "yarn hardhat typechain" => create typechain-types folder with types for all our contracts
import "@typechain/hardhat";

// solhint : The linting solutions available for detecting code vulnerabilities of the Solidity programming
// language — underlying smart contracts in Ethereum — mostly focus on the code compliance with the best
// linting practices.
// usage : yrn hardhat check
import "@nomiclabs/hardhat-solhint";

// a Hardhat Plugin For Replicable Deployments And Easy Testing
import "hardhat-deploy";

// Variables
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const RPC_URL = process.env.RPC_URL!;
const ETHER_SCAN_API_KEY = process.env.ETHERSCAN_API_KEY!;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY!;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL!;
const GOARLI_RPC_URL = process.env.GOARLI_RPC_URL!;

const config: HardhatUserConfig = {
  // ? if you don't specify defaultNetwork it's by the default "hardhat" => defaultNetwork: "hardhat"
  // solidity: "0.8.8",
  solidity: {
    compilers: [
      { version: "0.8.8", settings: {} },
      { version: "0.6.6", settings: {} },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
    goerli: {
      chainId: 5,
      url: GOARLI_RPC_URL,
      accounts: [PRIVATE_KEY!],
    },
    rinkeby: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY!],
      chainId: 4,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      //acctounts : they are automatically provided by hardhat, 19 fake accounts
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHER_SCAN_API_KEY,
  },
  gasReporter: {
    // change it to true to enable gas reporter
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    // specify the gas price "token" convert to USD, by the default it's ETH
    // token:"ETH"
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
};

export default config;
