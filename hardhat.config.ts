/**
* @type import('hardhat/config').HardhatUserConfig
*/
import * as dotenv from "dotenv";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "./tasks/mint-nft";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();
const { STAGING_API_URL, STAGING_PRIVATE_KEY, ETHERSCAN_KEY } = process.env;

const config: HardhatUserConfig = {
   solidity: "0.8.1",
   defaultNetwork: "hardhat",
   networks: {
      hardhat: {},
      rinkeby: {
         url: STAGING_API_URL,
         accounts: [`0x${STAGING_PRIVATE_KEY}`]
      }
   },
   etherscan: {
      // Your API key for Etherscan
      // Obtain one at https://etherscan.io/
      apiKey: ETHERSCAN_KEY
    }
 };
 
 export default config;