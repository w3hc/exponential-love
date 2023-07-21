import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-verify";

dotenv.config();

const { 

  GOERLI_TESTNET_ENDPOINT_URL, 
  GOERLI_TESTNET_PRIVATE_KEY, 
  GOERLI_ETHERSCAN_API_KEY, 

} = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  mocha: {
    timeout: 100000
  },
  networks: {
    'hardhat': {
      chainId: 1337,
      allowUnlimitedContractSize: true
    },
    'goerli': {
      url: GOERLI_TESTNET_ENDPOINT_URL as string,
      accounts: GOERLI_TESTNET_PRIVATE_KEY !== undefined ? [GOERLI_TESTNET_PRIVATE_KEY] : [],
    }
  }, 
  etherscan: {
    apiKey: {
      goerli: GOERLI_ETHERSCAN_API_KEY || ""
    },
  },
};

export default config;
